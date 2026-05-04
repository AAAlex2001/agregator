from models.question import OrderQuestion
from services.questions.repository import QuestionRepository


class ListQuestionsUseCase:
    "Список вопросов по заказу. Виден всем авторизованным."

    def __init__(self, repo: QuestionRepository):
        self.repo = repo

    async def execute(self, order_id: int) -> list[OrderQuestion]:
        return await self.repo.list_by_order(order_id)
