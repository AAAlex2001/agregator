from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.order import Order
from models.response import OrderResponse, ResponseStatus
from models.review import Review
from models.user import User, UserRole
from schemas.order import OrderDocuments
from services.orders.documents import OrderDocumentsService


def format_sum(sum_amount: int | None) -> str:
    if not sum_amount:
        return "Не определено"

    roubles = sum_amount // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if sum_amount % 100:
        return f"{formatted},{sum_amount % 100:02d} ₽"
    return f"{formatted} ₽"


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_review(self, actor_id: int, response_id: int, rating: int, comment: str) -> Review:
        actor_result = await self.db.execute(select(User).where(User.id == actor_id))
        actor = actor_result.scalars().first()
        if not actor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
        if actor.role != UserRole.CUSTOMER:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только заказчик может оставить отзыв")

        response_result = await self.db.execute(
            select(OrderResponse)
            .options(
                selectinload(OrderResponse.order),
                selectinload(OrderResponse.expert),
            )
            .where(OrderResponse.id == response_id)
        )
        response = response_result.scalars().first()
        if not response:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Отклик не найден")

        if not response.order or response.order.customer_id != actor_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нельзя оставить отзыв для чужого заказа")

        if response.status != ResponseStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Оставить отзыв можно только после завершения проекта",
            )

        expert = response.expert
        if not expert:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Исполнитель не найден")

        review = Review(
            order_id=response.order_id,
            response_id=response.id,
            customer_id=actor_id,
            expert_id=response.expert_id,
            rating=rating,
            comment=comment,
        )
        self.db.add(review)

        try:
            await self.db.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отзыв по этому отклику уже оставлен",
            )

        count, avg = (
            await self.db.execute(
                select(func.count(Review.id), func.avg(Review.rating))
                .where(Review.expert_id == expert.id)
            )
        ).one()
        expert.review_count = int(count or 0)
        expert.rating = round(float(avg), 1) if avg is not None else None

        return review

    async def get_expert_reviews(self, expert_id: int, skip: int, limit: int):
        "Постраничная выдача отзывов эксперта. total/avg_rating берём из агрегированных полей User."
        list_query = (
            select(Review)
            .where(Review.expert_id == expert_id)
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit + 1)
        )
        rows = list((await self.db.execute(list_query)).scalars().all())
        has_more = len(rows) > limit
        reviews = rows[:limit]

        response_ids = list({r.response_id for r in reviews})
        responses_map = {}
        if response_ids:
            responses_result = await self.db.execute(
                select(OrderResponse)
                .options(
                    selectinload(OrderResponse.order).selectinload(Order.badges),
                )
                .where(OrderResponse.id.in_(response_ids))
            )
            for response in responses_result.scalars().all():
                responses_map[response.id] = response

        items = []
        for r in reviews:
            response = responses_map.get(r.response_id)
            order = response.order if response else None
            company_name = (order.company if order and order.company else "Компания не указана")
            items.append({
                "id": r.id,
                "order_title": order.title if order else "",
                "company_name": company_name,
                "order_sum": format_sum(order.sum_amount if order else None),
                "order_deadline": order.deadline.strftime("%d.%m.%Y") if order and order.deadline else "",
                "expert_deadline": response.proposed_deadline.strftime("%d.%m.%Y") if response and response.proposed_deadline else "",
                "expert_sum": format_sum(response.proposed_sum_amount if response else None),
                "order_documents": (
                    OrderDocumentsService.from_order(order) if order else OrderDocuments()
                ),
                "badges": [
                    {"text": badge.text, "variant": badge.variant.value.lower()}
                    for badge in (order.badges if order and order.badges else [])
                ],
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at,
            })

        expert = (await self.db.execute(select(User).where(User.id == expert_id))).scalars().first()
        total_reviews = int(expert.review_count or 0) if expert else 0
        avg_rating = float(expert.rating or 0) if expert else 0.0

        return items, has_more, total_reviews, avg_rating

    async def get_expert_reviews_by_public_id(self, public_id: str, skip: int, limit: int):
        "Публичный доступ к отзывам исполнителя по UUID."
        result = await self.db.execute(
            select(User).where(User.public_id == public_id, User.role == UserRole.EXPERT)
        )
        expert = result.scalars().first()
        if not expert:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Исполнитель не найден")

        items, has_more, total_reviews, avg_rating = await self.get_expert_reviews(expert.id, skip, limit)

        expert_name_parts = [expert.first_name or "", expert.last_name or ""]
        expert_name = " ".join(p for p in expert_name_parts if p).strip()

        return {
            "expert_public_id": expert.public_id,
            "expert_name": expert_name,
            "expert_avatar_url": expert.avatar_url,
            "reviews": items,
            "has_more": has_more,
            "total_reviews": total_reviews,
            "avg_rating": avg_rating,
        }
