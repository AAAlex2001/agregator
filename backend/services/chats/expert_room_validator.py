from fastapi import HTTPException, status

from models.user import User, UserRole
from services.chats.expert_room_repository import ExpertRoomRepository


class ExpertRoomValidator:
    "Проверка прав и бана для общего чата экспертов."

    def __init__(self, repo: ExpertRoomRepository):
        self.repo = repo

    async def require_expert(self, user_id: int) -> User:
        user = await self.repo.find_user(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Сессия истекла"
            )
        if user.role != UserRole.EXPERT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Чат доступен только экспертам",
            )
        return user

    async def ensure_not_banned(self, user_id: int) -> None:
        ban = await self.repo.find_ban(user_id)
        if ban is None:
            return
        message = "Вы заблокированы в чате экспертов."
        if ban.reason:
            message = f"{message} {ban.reason}"
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=message)
