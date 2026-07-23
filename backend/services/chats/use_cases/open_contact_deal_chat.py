from fastapi import HTTPException, status

from models.chat import Chat
from services.chats.repository import ChatRepository


class OpenContactDealChatUseCase:
    def __init__(self, repository: ChatRepository) -> None:
        self.repository = repository

    async def execute(self, deal_id: int, actor_id: int) -> Chat:
        deal = await self.repository.find_contact_deal(
            deal_id,
            for_update=True,
        )
        if deal is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Сделка не найдена",
            )
        if actor_id not in {deal.buyer_id, deal.seller_id}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет доступа к этой сделке",
            )

        chat = await self.repository.find_contact_deal_chat(deal.id)
        if chat is not None:
            return chat
        chat = Chat(
            contact_deal_id=deal.id,
            customer_id=deal.buyer_id,
            expert_id=deal.seller_id,
        )
        await self.repository.add(chat)
        await self.repository.flush()
        return chat
