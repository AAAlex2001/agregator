"Форматирование сущностей в API-структуры."
from dataclasses import dataclass

from models.account import UserRole
from models.chat import Chat, ChatMessage
from models.contact_deal import ContactDealStatus
from models.order import OrderStatus
from schemas.chat import ChatAttachmentData

NOTIFICATION_PREVIEW_MAX = 140


@dataclass(frozen=True)
class CounterpartInfo:
    "DTO с данными для передачи между слоями."
    id: int
    display_name: str
    avatar_url: str | None


class ChatFormatter:
    "Форматирование данных чата для API-ответов и уведомлений."

    @staticmethod
    def format_sum(amount_kopecks: int) -> str:
        "Форматирует значение для отображения."
        roubles = amount_kopecks // 100
        formatted = f"{roubles:,}".replace(",", " ")
        if amount_kopecks % 100:
            return f"{formatted},{amount_kopecks % 100:02d} ₽"
        return f"{formatted} ₽"

    @staticmethod
    def build_attachments(message: ChatMessage) -> list[ChatAttachmentData]:
        "Строит объект из входных данных."
        raw = list(message.attachments or [])
        if not raw and message.file_url and message.file_name:
            raw = [{"url": message.file_url, "name": message.file_name}]
        return [
            ChatAttachmentData(url=item["url"], name=item["name"])
            for item in raw
            if item.get("url") and item.get("name")
        ]

    @classmethod
    def last_message_text(cls, message: ChatMessage | None) -> str:
        "Текст последнего сообщения для превью."
        if message is None:
            return ""
        text = (message.text or "").strip()
        if text:
            return text
        attachments = cls.build_attachments(message)
        if len(attachments) == 1:
            return attachments[0].name
        if len(attachments) > 1:
            return f"Файлы: {len(attachments)}"
        return ""

    @staticmethod
    def notification_preview(text: str, attachments_count: int) -> str:
        "Подготавливает превью для уведомления."
        normalized = text.strip()
        if normalized:
            if len(normalized) <= NOTIFICATION_PREVIEW_MAX:
                return normalized
            return f"{normalized[: NOTIFICATION_PREVIEW_MAX - 3]}..."
        if attachments_count == 1:
            return "Новое сообщение с вложением"
        return f"Новое сообщение с {attachments_count} файлами"

    @classmethod
    def counterpart(cls, actor_id: int, chat: Chat) -> CounterpartInfo:
        "Возвращает данные противоположной стороны чата."
        if actor_id == chat.customer_id:
            return cls.counterpart_for_customer(chat)
        return cls.counterpart_for_expert(chat)

    @staticmethod
    def counterpart_for_customer(chat: Chat) -> CounterpartInfo:
        "Возвращает данные противоположной стороны чата."
        expert = chat.expert
        if expert is None:
            return CounterpartInfo(
                id=chat.expert_id, display_name=f"Эксперт #{chat.expert_id}", avatar_url=None
            )
        full_name = " ".join(
            part for part in [expert.first_name, expert.last_name] if part
        ).strip()
        return CounterpartInfo(
            id=expert.id,
            display_name=full_name or f"Эксперт #{expert.id}",
            avatar_url=expert.avatar_url,
        )

    @staticmethod
    def counterpart_for_expert(chat: Chat) -> CounterpartInfo:
        "Возвращает данные противоположной стороны чата."
        customer = chat.customer
        if customer is None:
            return CounterpartInfo(
                id=chat.customer_id,
                display_name=f"Заказчик #{chat.customer_id}",
                avatar_url=None,
            )
        company = chat.order.company if chat.order and chat.order.company else ""
        if not company and customer.company_data:
            company = (
                (((customer.company_data.get("data") or {}).get("name") or {}).get("short_with_opf"))
                or customer.company_data.get("value")
                or ""
            )
        full_name = " ".join(
            part for part in [customer.first_name, customer.last_name] if part
        ).strip()
        return CounterpartInfo(
            id=customer.id,
            display_name=company or full_name or f"Заказчик #{customer.id}",
            avatar_url=customer.avatar_url,
        )

    @staticmethod
    def sender_role(chat: Chat, sender_id: int) -> UserRole:
        "Определяет роль отправителя в чате."
        if sender_id == chat.customer_id:
            return chat.customer.role
        return chat.expert.role

    @staticmethod
    def is_chat_blocked(chat: Chat) -> bool:
        "Определяет, завершён ли связанный с чатом сценарий."
        if chat.is_blocked:
            return True
        if chat.order is not None and chat.order.status == OrderStatus.ARCHIVED:
            return True
        if chat.labor_listing is not None and not chat.labor_listing.is_active:
            return True
        return (
            chat.contact_deal is not None
            and chat.contact_deal.status
            in {
                ContactDealStatus.CONTACTS_RELEASED,
                ContactDealStatus.CANCELED,
            }
        )
