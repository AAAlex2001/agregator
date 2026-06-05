"Use case: create session."
from models.session import Session
from services.login.repository import LoginRepository


class CreateSessionUseCase:
    "Создаёт новую сессию для юзера."

    def __init__(self, repo: LoginRepository) -> None:
        self.repo = repo

    async def execute(self, user_id: int) -> Session:
        "Запускает основной сценарий use case."
        return await self.repo.add_session(user_id)
