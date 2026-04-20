from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.order import Order
from models.response import OrderResponse, ResponseStatus
from models.review import Review
from models.user import User, UserRole


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

        current_count = expert.review_count or 0
        current_rating = Decimal(str(expert.rating)) if expert.rating is not None else Decimal("0")
        new_count = current_count + 1
        new_rating = ((current_rating * current_count) + Decimal(rating)) / Decimal(new_count)
        new_rating = new_rating.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)

        expert.review_count = new_count
        expert.rating = new_rating

        try:
            await self.db.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отзыв по этому отклику уже оставлен",
            )

        return review

    async def get_expert_reviews(self, expert_id: int):
        """Возвращает все отзывы, оставленные для данного эксперта."""
        result = await self.db.execute(
            select(Review)
            .where(Review.expert_id == expert_id)
            .order_by(Review.created_at.desc())
        )
        reviews = result.scalars().all()
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
                "technical_files": order.technical_files if order and order.technical_files else [],
                "badges": [
                    {"text": badge.text, "variant": badge.variant.value.lower()}
                    for badge in (order.badges if order and order.badges else [])
                ],
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at,
            })

        total = len(items)
        avg_rating = 0.0
        if total > 0:
            avg_rating = round(sum(i["rating"] for i in items) / total, 1)

        return items, total, avg_rating

    async def get_expert_reviews_by_public_id(self, public_id: str):
        """Публичный доступ к отзывам исполнителя по UUID."""
        result = await self.db.execute(
            select(User).where(User.public_id == public_id, User.role == UserRole.EXPERT)
        )
        expert = result.scalars().first()
        if not expert:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Исполнитель не найден")

        items, total, avg_rating = await self.get_expert_reviews(expert.id)

        expert_name_parts = [expert.first_name or "", expert.last_name or ""]
        expert_name = " ".join(p for p in expert_name_parts if p).strip()

        return {
            "expert_public_id": expert.public_id,
            "expert_name": expert_name,
            "expert_avatar_url": expert.avatar_url,
            "reviews": items,
            "total": total,
            "avg_rating": avg_rating,
        }
