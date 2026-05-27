from types import SimpleNamespace

from services.email.dispatcher import EmailDispatcher


class TestCanSend:
    "EmailDispatcher.can_send — фильтр получателей по email + per-type флагу."

    def test_no_user_returns_false(self):
        assert EmailDispatcher.can_send(None, "email_on_chat_message") is False

    def test_no_email_returns_false(self):
        user = SimpleNamespace(email=None, email_on_chat_message=True)
        assert EmailDispatcher.can_send(user, "email_on_chat_message") is False

    def test_empty_email_returns_false(self):
        user = SimpleNamespace(email="", email_on_chat_message=True)
        assert EmailDispatcher.can_send(user, "email_on_chat_message") is False

    def test_preference_off_returns_false(self):
        user = SimpleNamespace(email="a@b.ru", email_on_chat_message=False)
        assert EmailDispatcher.can_send(user, "email_on_chat_message") is False

    def test_all_good_returns_true(self):
        user = SimpleNamespace(email="a@b.ru", email_on_chat_message=True)
        assert EmailDispatcher.can_send(user, "email_on_chat_message") is True

    def test_missing_field_defaults_to_false(self):
        "Если у юзера нет такого флага (старая миграция) — НЕ шлём. getattr с default=False."
        user = SimpleNamespace(email="a@b.ru")
        assert EmailDispatcher.can_send(user, "email_on_order_updated") is False

    def test_each_field_isolated(self):
        "Флаги независимы: включённый email_on_order_updated не влияет на email_on_chat_message."
        user = SimpleNamespace(
            email="a@b.ru",
            email_on_order_updated=True,
            email_on_chat_message=False,
        )
        assert EmailDispatcher.can_send(user, "email_on_order_updated") is True
        assert EmailDispatcher.can_send(user, "email_on_chat_message") is False
