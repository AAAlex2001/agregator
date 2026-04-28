from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.chat import (
    ChatDetailResponse,
    ChatListResponse,
    ChatMessageResponse,
    ChatOpenRequest,
    ChatPresenceResponse,
)
from services.chats import (
    ChatFileStorage,
    ChatInAppNotifier,
    ChatRepository,
    ChatValidator,
    GetChatByUuidUseCase,
    GetChatDetailUseCase,
    ListChatsUseCase,
    MarkMessagesReadUseCase,
    OpenChatUseCase,
    SendMessageUseCase,
)
from services.email import (
    EmailDispatcher,
    EmailRepository,
    SendChatMessageEmailUseCase,
)
from services.notifications import (
    CreateChatMessageNotificationUseCase,
    NotificationRepository,
)
from ws.manager import chat_manager

router = APIRouter(prefix="/chats", tags=["chats"])


def build_repo(db: AsyncSession) -> ChatRepository:
    return ChatRepository(db)


def build_get_chat_by_uuid(db: AsyncSession) -> GetChatByUuidUseCase:
    repo = build_repo(db)
    return GetChatByUuidUseCase(repo, ChatValidator(repo))


def build_get_chat_detail(db: AsyncSession) -> GetChatDetailUseCase:
    repo = build_repo(db)
    return GetChatDetailUseCase(repo, ChatValidator(repo))


def build_mark_read(db: AsyncSession) -> MarkMessagesReadUseCase:
    return MarkMessagesReadUseCase(build_repo(db))


async def broadcast_read(chat_id: int, read_ids: list[int]) -> None:
    if not read_ids:
        return
    await chat_manager.broadcast(
        chat_id,
        {"event": "messages_read", "data": {"message_ids": read_ids}},
    )


@router.post("/open", response_model=ChatDetailResponse)
async def open_chat(
    payload: ChatOpenRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    validator = ChatValidator(repo)
    open_use_case = OpenChatUseCase(repo, validator)
    detail_use_case = GetChatDetailUseCase(repo, validator)

    chat = await open_use_case.execute(actor_id=user_id, order_id=payload.order_id)
    return await detail_use_case.execute(chat_id=chat.id, actor_id=user_id, limit=200)


@router.get("/", response_model=ChatListResponse)
async def list_chats(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    use_case = ListChatsUseCase(repo, ChatValidator(repo))
    items = await use_case.execute(actor_id=user_id)
    return ChatListResponse(items=items, total=len(items))


@router.get("/{chat_uuid}", response_model=ChatDetailResponse)
async def get_chat(
    chat_uuid: str,
    limit: int = Query(200, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    chat = await build_get_chat_by_uuid(db).execute(chat_uuid, actor_id=user_id)
    detail = await build_get_chat_detail(db).execute(
        chat_id=chat.id, actor_id=user_id, limit=limit
    )

    read_ids = await build_mark_read(db).execute(chat_id=chat.id, reader_id=user_id)
    await broadcast_read(chat.id, read_ids)
    return detail


@router.get("/{chat_uuid}/presence", response_model=ChatPresenceResponse)
async def get_chat_presence(
    chat_uuid: str,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    chat = await build_get_chat_by_uuid(db).execute(chat_uuid, actor_id=user_id)
    online_ids = chat_manager.get_online_user_ids(chat.id)
    return ChatPresenceResponse(
        chat_id=chat.id,
        online_user_ids=online_ids,
        both_online=len(online_ids) >= 2,
    )


@router.post("/{chat_uuid}/read")
async def mark_chat_read(
    chat_uuid: str,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    chat = await build_get_chat_by_uuid(db).execute(chat_uuid, actor_id=user_id)
    read_ids = await build_mark_read(db).execute(chat_id=chat.id, reader_id=user_id)
    await broadcast_read(chat.id, read_ids)
    return {"updated": len(read_ids)}


@router.post("/{chat_uuid}/messages", response_model=ChatMessageResponse)
async def send_message(
    chat_uuid: str,
    background_tasks: BackgroundTasks,
    text: str = Form(""),
    file: UploadFile | None = File(default=None),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    chat = await build_get_chat_by_uuid(db).execute(chat_uuid, actor_id=user_id)

    uploads = [current_file for current_file in files if current_file.filename]
    if file and file.filename:
        uploads.insert(0, file)

    recipient_id = chat.expert_id if user_id == chat.customer_id else chat.customer_id
    recipient_online = recipient_id in chat_manager.get_online_user_ids(chat.id)

    repo = build_repo(db)
    send_email = SendChatMessageEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    )
    use_case = SendMessageUseCase(
        repo=repo,
        files=ChatFileStorage(),
        in_app=ChatInAppNotifier(
            CreateChatMessageNotificationUseCase(NotificationRepository(db))
        ),
        send_email=send_email,
    )
    message = await use_case.execute(
        chat_id=chat.id,
        sender_id=user_id,
        text=text,
        uploads=uploads,
        recipient_online=recipient_online,
    )
    await chat_manager.broadcast(
        chat.id,
        {"event": "chat_message", "data": message.model_dump(mode="json")},
    )
    return message
