from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.chat import (
    ChatDetailResponse,
    ChatListResponse,
    ChatMessageResponse,
    ChatOpenRequest,
    ChatPresenceResponse,
    ChatSendMessageRequest,
)
from services.chat import ChatService
from ws.manager import chat_manager

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("/open", response_model=ChatDetailResponse)
async def open_chat(
    payload: ChatOpenRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = ChatService(db)
    chat = await service.open_chat(actor_id=user_id, order_id=payload.order_id)
    return await service.get_chat_detail(chat_id=chat.id, actor_id=user_id)


@router.get("/", response_model=ChatListResponse)
async def list_chats(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = ChatService(db)
    items = await service.list_chats(actor_id=user_id)
    return ChatListResponse(items=items, total=len(items))


@router.get("/{chat_uuid}", response_model=ChatDetailResponse)
async def get_chat(
    chat_uuid: str,
    limit: int = Query(200, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = ChatService(db)
    chat = await service.get_chat_by_uuid(chat_uuid, actor_id=user_id)
    detail = await service.get_chat_detail(chat_id=chat.id, actor_id=user_id, limit=limit)

    read_ids = await service.mark_messages_read(chat_id=chat.id, reader_id=user_id)
    if read_ids:
        await chat_manager.broadcast(chat.id, {
            "event": "messages_read",
            "data": {"message_ids": read_ids},
        })

    return detail


@router.get("/{chat_uuid}/presence", response_model=ChatPresenceResponse)
async def get_chat_presence(
    chat_uuid: str,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = ChatService(db)
    chat = await service.get_chat_by_uuid(chat_uuid, actor_id=user_id)
    online_ids = chat_manager.get_online_user_ids(chat.id)
    return ChatPresenceResponse(
        chat_id=chat.id,
        online_user_ids=online_ids,
        both_online=len(online_ids) >= 2,
    )


@router.post("/{chat_uuid}/messages", response_model=ChatMessageResponse)
async def send_message(
    chat_uuid: str,
    payload: ChatSendMessageRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = ChatService(db)
    chat = await service.get_chat_by_uuid(chat_uuid, actor_id=user_id)
    message = await service.send_message(chat_id=chat.id, sender_id=user_id, text=payload.text)
    await chat_manager.broadcast(
        chat.id,
        {"event": "chat_message", "data": message.model_dump(mode="json")},
    )
    return message
