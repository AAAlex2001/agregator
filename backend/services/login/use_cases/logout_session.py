from services.login.repository import LoginRepository


class LogoutSessionUseCase:
    "Удаляет сессию по cookie."

    def __init__(self, repo: LoginRepository):
        self.repo = repo

    async def execute(self, session_id: str | None) -> None:
        if session_id:
            await self.repo.delete_session_by_uuid(session_id)
