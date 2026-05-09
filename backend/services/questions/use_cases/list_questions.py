from fastapi import HTTPException, status

from models.question import OrderQuestion
from models.user import UserRole
from services.questions.repository import QuestionRepository


class ListQuestionsUseCase:
    "Заказчик-владелец видит всё; эксперт — публичные и свои; остальные — только публичные."

    def __init__(self, repo: QuestionRepository):
        self.repo = repo

    async def execute(
        self,
        order_id: int,
        viewer_id: int,
        viewer_role: UserRole | None,
    ) -> list[OrderQuestion]:
        order = await self.repo.get_order(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден",
            )

        if viewer_role == UserRole.CUSTOMER and order.customer_id == viewer_id:
            return await self.repo.list_by_order(order_id)
        if viewer_role == UserRole.EXPERT:
            return await self.repo.list_visible_for_expert(order_id, viewer_id)
        return await self.repo.list_public_by_order(order_id)
