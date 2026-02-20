from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.response import OrderResponse, ResponseStatus
from models.review import Review
from models.user import User, UserRole


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
            await self.db.commit()
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отзыв по этому отклику уже оставлен",
            )

        return review
