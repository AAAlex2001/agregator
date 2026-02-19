from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
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
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ChatService(db)
    chat = await service.open_chat(actor_id=x_user_id, order_id=payload.order_id)
    return await service.get_chat_detail(chat_id=chat.id, actor_id=x_user_id)


@router.get("/", response_model=ChatListResponse)
async def list_chats(
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ChatService(db)
    items = await service.list_chats(actor_id=x_user_id)
    return ChatListResponse(items=items, total=len(items))


@router.get("/{chat_id}", response_model=ChatDetailResponse)
async def get_chat(
    chat_id: int,
    limit: int = Query(200, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ChatService(db)
    return await service.get_chat_detail(chat_id=chat_id, actor_id=x_user_id, limit=limit)


@router.get("/{chat_id}/presence", response_model=ChatPresenceResponse)
async def get_chat_presence(
    chat_id: int,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ChatService(db)
    await service.get_chat_for_actor(chat_id=chat_id, actor_id=x_user_id)
    online_ids = chat_manager.get_online_user_ids(chat_id)
    return ChatPresenceResponse(
        chat_id=chat_id,
        online_user_ids=online_ids,
        both_online=len(online_ids) >= 2,
    )


@router.post("/{chat_id}/messages", response_model=ChatMessageResponse)
async def send_message(
    chat_id: int,
    payload: ChatSendMessageRequest,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ChatService(db)
    message = await service.send_message(chat_id=chat_id, sender_id=x_user_id, text=payload.text)
    await chat_manager.broadcast(
        chat_id,
        {"event": "chat_message", "data": message.model_dump(mode="json")},
    )
    return message
