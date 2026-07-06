from types import SimpleNamespace

from services.email.dispatcher import EmailDispatcher, telegram_text


class TestCanSend:
    "EmailDispatcher.can_send — фильтр получателей по email + per-type флагу."

    def test_no_user_returns_false(self):
        assert EmailDispatcher.can_send(None, "email_on_chat_message") is False

    def test_none_preference_requires_only_email(self):
        "preference_field=None — событие без отдельного тумблера, достаточно email."
        assert EmailDispatcher.can_send(SimpleNamespace(email="a@b.ru"), None) is True
        assert EmailDispatcher.can_send(SimpleNamespace(email=None), None) is False

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


class TestTelegramText:
    "telegram_text — текст письма (.txt) превращается в Telegram-сообщение без ссылок-переходов."

    CTA = "Чтобы продолжить, откройте приложение."
    SIGNATURE = "—\nРесурс-Плюс · plus-resurs.com"

    def test_first_line_becomes_bold_heading(self):
        result = telegram_text("Заголовок\nТело письма", self.CTA)
        assert result == f"<b>Заголовок</b>\nТело письма\n\n{self.CTA}\n\n{self.SIGNATURE}"

    def test_cta_links_stripped_signature_kept(self):
        text = (
            "Заголовок\n\nТело\n\nОткрыть чат: https://plus-resurs.com/chat/abc\n\n"
            "—\nРесурс-Плюс · plus-resurs.com"
        )
        result = telegram_text(text, self.CTA)
        assert "https://" not in result
        assert result == f"<b>Заголовок</b>\nТело\n\n{self.CTA}\n\n{self.SIGNATURE}"

    def test_unsubscribe_tail_stripped(self):
        text = "Заголовок\nТело\nВы получили это письмо, так как включены уведомления."
        result = telegram_text(text, self.CTA)
        assert result == f"<b>Заголовок</b>\nТело\n\n{self.CTA}\n\n{self.SIGNATURE}"

    def test_user_input_escaped_for_html(self):
        result = telegram_text("Заголовок\nКомментарий: <script> & \"кавычки\"", self.CTA)
        assert "<script>" not in result
        assert "&lt;script&gt;" in result

