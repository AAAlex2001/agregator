"Use case: authenticate expert room ws."
from dataclasses import dataclass

from models.account import UserRole
from services.chats.expert_room_repository import ExpertRoomRepository
from services.email.formatting import full_name

WS_CLOSE_UNAUTHORIZED = 4001
WS_CLOSE_FORBIDDEN = 4003


class WsCloseError(Exception):
    "Поднимается из use case'а аутентификации WS — роут закрывает сокет с этим кодом."

    def __init__(self, code: int) -> None:
        self.code = code


@dataclass(frozen=True)
class ExpertRoomConnectInfo:
    "DTO с данными для передачи между слоями."
    user_id: int
    display_name: str


class AuthenticateExpertRoomWsUseCase:
    "Проверяет cookie-сессию, роль EXPERT, отсутствие бана. Возвращает ConnectInfo."

    def __init__(self, repo: ExpertRoomRepository) -> None:
        self.repo = repo

    async def execute(self, session_id: str | None) -> ExpertRoomConnectInfo:
        "Запускает основной сценарий use case."
        if not session_id:
            raise WsCloseError(WS_CLOSE_UNAUTHORIZED)

        session = await self.repo.find_active_session(session_id)
        if session is None:
            raise WsCloseError(WS_CLOSE_UNAUTHORIZED)

        user = await self.repo.find_user(session.user_id)
        if user is None or user.role != UserRole.EXPERT:
            raise WsCloseError(WS_CLOSE_FORBIDDEN)

        if await self.repo.is_banned(user.id):
            raise WsCloseError(WS_CLOSE_FORBIDDEN)

        display_name = full_name(user) or (user.email or f"id:{user.id}")
        return ExpertRoomConnectInfo(user_id=user.id, display_name=display_name)
