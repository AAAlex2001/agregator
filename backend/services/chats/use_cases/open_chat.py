"Use case: open chat."
from fastapi import HTTPException, status

from models.chat import Chat
from models.order import Order
from models.user import User, UserRole
from services.chats.repository import ChatRepository
from services.chats.validators import ChatValidator


class OpenChatUseCase:
    "Открывает (или возвращает) чат по заказу для актёра. Идемпотентно."

    def __init__(self, repo: ChatRepository, validator: ChatValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, actor_id: int, order_id: int, expert_id: int | None = None) -> Chat:
        "Запускает основной сценарий use case."
        actor = await self.validator.require_active_user(actor_id)
        order = await self.require_order(order_id)

        if expert_id is not None and actor.role == UserRole.CUSTOMER:
            return await self.require_pair_chat(order, actor, expert_id)

        existing = await self.find_existing_for_actor(actor, order)
        if existing is not None:
            return existing

        self.validator.ensure_order_assigned(order)
        self.validator.ensure_actor_belongs_to_order(actor, order)

        pair = await self.repo.find_pair_chat(
            order.id, order.customer_id, order.assigned_expert_id
        )
        if pair is not None:
            return pair

        chat = Chat(
            order_id=order.id,
            customer_id=order.customer_id,
            expert_id=order.assigned_expert_id,
        )
        await self.repo.add(chat)
        await self.repo.flush()
        return chat

    async def require_pair_chat(self, order: Order, actor: User, expert_id: int) -> Chat:
        "Чат заказчика с конкретным экспертом. Создаётся при принятии отклика — здесь только ищем."
        if order.customer_id != actor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет доступа к чату этого заказа",
            )
        chat = await self.repo.find_pair_chat(order.id, actor.id, expert_id)
        if chat is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Чат с этим экспертом не найден",
            )
        return chat

    async def require_order(self, order_id: int) -> Order:
        "Возвращает требуемую сущность или бросает 404."
        order = await self.repo.find_order(order_id)
        if order is not None:
            return order
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден"
        )

    async def find_existing_for_actor(self, actor: User, order: Order) -> Chat | None:
        "Ищет сущность по заданным параметрам."
        if actor.role == UserRole.CUSTOMER:
            return await self.repo.find_latest_chat_for_customer(order.id, actor.id)
        return await self.repo.find_latest_chat_for_expert(order.id, actor.id)
