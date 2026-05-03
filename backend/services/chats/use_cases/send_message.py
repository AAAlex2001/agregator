from fastapi import HTTPException, UploadFile, status

from models.chat import Chat, ChatMessage
from models.order import OrderStatus
from schemas.chat import ChatAttachmentData, ChatMessageResponse
from services.chats.file_storage import ChatFileStorage
from services.chats.formatters import ChatFormatter
from services.chats.in_app_notifier import ChatInAppNotifier
from services.chats.repository import ChatRepository
from services.email import SendChatMessageEmailUseCase


class SendMessageUseCase:
    "Создаёт сообщение в чате, сохраняет вложения, шлёт in-app и при оффлайн-получателе — email."

    def __init__(
        self,
        repo: ChatRepository,
        files: ChatFileStorage,
        in_app: ChatInAppNotifier,
        send_email: SendChatMessageEmailUseCase | None = None,
    ):
        self.repo = repo
        self.files = files
        self.in_app = in_app
        self.send_email = send_email

    async def execute(
        self,
        chat_id: int,
        sender_id: int,
        text: str,
        uploads: list[UploadFile],
        recipient_online: bool,
    ) -> ChatMessageResponse:
        normalized_text = text.strip()
        non_empty_uploads = [file for file in uploads if file and file.filename]
        self.ensure_not_empty(normalized_text, non_empty_uploads)

        chat = await self.require_chat(chat_id, sender_id)
        self.ensure_chat_not_blocked(chat)
        attachments = await self.save_attachments(chat_id, non_empty_uploads)

        mark_as_read = recipient_online
        message = self.build_message(
            chat_id, sender_id, normalized_text, attachments, mark_as_read
        )
        await self.repo.add(message)
        await self.repo.flush()
        await self.repo.touch_chat(chat_id)
        await self.repo.flush()

        await self.in_app.new_message(
            chat=chat,
            sender_id=sender_id,
            text=normalized_text,
            attachments_count=len(attachments),
        )

        if self.send_email is not None:
            await self.send_email.execute(message.id, recipient_online=recipient_online)

        return self.build_response(chat, message, mark_as_read)

    @staticmethod
    def ensure_not_empty(text: str, uploads: list[UploadFile]) -> None:
        if text or uploads:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Сообщение не может быть пустым",
        )

    async def require_chat(self, chat_id: int, sender_id: int) -> Chat:
        chat = await self.repo.find_chat_by_id_with_order(chat_id, sender_id)
        if chat is not None:
            return chat
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден"
        )

    @staticmethod
    def ensure_chat_not_blocked(chat: Chat) -> None:
        if chat.is_blocked:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Заказчик вас заблокировал.",
            )
        if chat.order is None or chat.order.status != OrderStatus.COMPLETED:
            return
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Чат по этому заказу завершен",
        )

    async def save_attachments(
        self, chat_id: int, uploads: list[UploadFile]
    ) -> list[ChatAttachmentData]:
        if not uploads:
            return []
        return await self.files.save(chat_id, uploads)

    @staticmethod
    def build_message(
        chat_id: int,
        sender_id: int,
        text: str,
        attachments: list[ChatAttachmentData],
        mark_as_read: bool,
    ) -> ChatMessage:
        first_url = attachments[0].url if attachments else None
        first_name = attachments[0].name if attachments else None
        return ChatMessage(
            chat_id=chat_id,
            sender_id=sender_id,
            text=text,
            file_url=first_url,
            file_name=first_name,
            attachments=[{"url": a.url, "name": a.name} for a in attachments],
            is_read=mark_as_read,
        )

    @staticmethod
    def build_response(
        chat: Chat, message: ChatMessage, mark_as_read: bool
    ) -> ChatMessageResponse:
        sender_role = ChatFormatter.sender_role(chat, message.sender_id)
        return ChatMessageResponse(
            id=message.id,
            chat_id=message.chat_id,
            sender_id=message.sender_id,
            sender_role=sender_role.value,
            text=message.text,
            file_url=message.file_url,
            file_name=message.file_name,
            attachments=ChatFormatter.build_attachments(message),
            is_read=mark_as_read,
            created_at=message.created_at,
        )
