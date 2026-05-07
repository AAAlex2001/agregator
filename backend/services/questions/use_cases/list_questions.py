from models.question import OrderQuestion
from models.user import UserRole
from services.questions.repository import QuestionRepository


class ListQuestionsUseCase:
    "Список вопросов по заказу. Заказчик видит все, эксперт — только публичные и свои."

    def __init__(self, repo: QuestionRepository):
        self.repo = repo

    async def execute(
        self,
        order_id: int,
        viewer_id: int,
        viewer_role: UserRole | None,
    ) -> list[OrderQuestion]:
        if viewer_role == UserRole.CUSTOMER:
            order = await self.repo.get_order(order_id)
            if order is not None and order.customer_id == viewer_id:
                return await self.repo.list_by_order(order_id)
        return await self.repo.list_visible_for_expert(order_id, viewer_id)
