from types import SimpleNamespace

from models.contact_deal import ContactDealStatus
from models.account import UserRole
from services.chats.formatters import NOTIFICATION_PREVIEW_MAX, ChatFormatter


class TestNotificationPreview:
    "Превью для push/email: короткое — как есть, длинное — обрезается с троеточием."

    def test_short_text_returned_as_is(self):
        assert ChatFormatter.notification_preview("короткое", 0) == "короткое"

    def test_long_text_truncated(self):
        text = "а" * 500
        preview = ChatFormatter.notification_preview(text, 0)
        assert len(preview) == NOTIFICATION_PREVIEW_MAX
        assert preview.endswith("...")

    def test_empty_text_with_one_attachment(self):
        assert ChatFormatter.notification_preview("", 1) == "Новое сообщение с вложением"

    def test_empty_text_with_many_attachments(self):
        assert ChatFormatter.notification_preview("", 3) == "Новое сообщение с 3 файлами"

    def test_whitespace_only_treated_as_empty(self):
        assert ChatFormatter.notification_preview("   \n  ", 2) == "Новое сообщение с 2 файлами"


class TestCounterpart:
    "Для customer показываем эксперта, для expert — заказчика."

    def setup_method(self):
        self.expert = SimpleNamespace(
            id=42, first_name="Иван", last_name="Петров", avatar_url="/avatar.png"
        )
        self.customer = SimpleNamespace(
            id=1, first_name="Ольга", last_name="Смирнова", avatar_url=None, company_data=None
        )
        self.order = SimpleNamespace(company="ООО Компания")
        self.chat = SimpleNamespace(
            customer_id=1,
            expert_id=42,
            customer=self.customer,
            expert=self.expert,
            order=self.order,
        )

    def test_customer_sees_expert(self):
        info = ChatFormatter.counterpart(UserRole.CUSTOMER, self.chat)
        assert info.id == 42
        assert info.display_name == "Иван Петров"
        assert info.avatar_url == "/avatar.png"

    def test_expert_sees_company_name_first(self):
        "Для эксперта приоритет — название компании заказчика."
        info = ChatFormatter.counterpart(UserRole.EXPERT, self.chat)
        assert info.id == 1
        assert info.display_name == "ООО Компания"

    def test_expert_falls_back_to_full_name(self):
        "Если компании нет — имя+фамилия."
        self.chat.order = SimpleNamespace(company="")
        info = ChatFormatter.counterpart(UserRole.EXPERT, self.chat)
        assert info.display_name == "Ольга Смирнова"

    def test_missing_counterpart_uses_id(self):
        "Если объект отношения не подгружен — показываем id как заглушку."
        self.chat.expert = None
        info = ChatFormatter.counterpart(UserRole.CUSTOMER, self.chat)
        assert info.id == 42
        assert info.display_name == "Эксперт #42"


class TestChatBlocked:
    def test_inactive_labor_listing_closes_chat(self):
        chat = SimpleNamespace(
            is_blocked=False,
            order=None,
            labor_listing=SimpleNamespace(is_active=False),
            contact_deal=None,
        )

        assert ChatFormatter.is_chat_blocked(chat) is True

    def test_released_contact_deal_closes_chat(self):
        chat = SimpleNamespace(
            is_blocked=False,
            order=None,
            labor_listing=None,
            contact_deal=SimpleNamespace(
                status=ContactDealStatus.CONTACTS_RELEASED
            ),
        )

        assert ChatFormatter.is_chat_blocked(chat) is True

    def test_active_labor_chat_remains_open(self):
        chat = SimpleNamespace(
            is_blocked=False,
            order=None,
            labor_listing=SimpleNamespace(is_active=True),
            contact_deal=None,
        )

        assert ChatFormatter.is_chat_blocked(chat) is False
