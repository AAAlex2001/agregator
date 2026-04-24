from uuid import UUID

from fastapi import HTTPException, status

from models.order import Order
from models.user import User
from services.chats.repository import ChatRepository


class ChatValidator:
    "Проверка прав доступа и валидация входных данных чата."

    def __init__(self, repo: ChatRepository):
        self.repo = repo

    async def ensure_active_user(self, user_id: int) -> User:
        user = await self.repo.find_user(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Пользователь неактивен"
            )
        return user

    @staticmethod
    def parse_uuid(chat_uuid: str) -> UUID:
        try:
            return UUID(chat_uuid)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден"
            )

    @staticmethod
    def ensure_order_assigned(order: Order) -> None:
        if order.assigned_expert_id is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Чат можно открыть после назначения эксперта",
            )

    @staticmethod
    def ensure_actor_belongs_to_order(actor: User, order: Order) -> None:
        if actor.id in {order.customer_id, order.assigned_expert_id}:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к чату этого заказа",
        )
