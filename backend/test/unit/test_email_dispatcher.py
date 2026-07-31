from types import SimpleNamespace

from services.email.dispatcher import (
    SIGNATURE,
    EmailDispatcher,
    preference_enabled,
    telegram_text,
)


def build_account(
    email: str | None = "a@b.ru",
    customer: dict | None = None,
    expert: dict | None = None,
    license_holder: dict | None = None,
    **account_fields: object,
) -> SimpleNamespace:
    "Аккаунт с профилями ролей: тумблеры лежат либо на аккаунте, либо в профиле."
    return SimpleNamespace(
        email=email,
        customer_profile=SimpleNamespace(**customer) if customer is not None else None,
        expert_profile=SimpleNamespace(**expert) if expert is not None else None,
        license_holder_profile=SimpleNamespace(**license_holder) if license_holder is not None else None,
        **account_fields,
    )


class TestPreferenceEnabled:
    "preference_enabled — тумблер ищется в аккаунте, затем в профиле роли."

    def test_account_level_field(self):
        account = build_account(email_on_chat_message=True)
        assert preference_enabled(account, "email_on_chat_message") is True

    def test_customer_profile_field(self):
        account = build_account(customer={"email_on_response_created": True})
        assert preference_enabled(account, "email_on_response_created") is True

    def test_expert_profile_field_off(self):
        account = build_account(expert={"email_on_order_updated": False})
        assert preference_enabled(account, "email_on_order_updated") is False

    def test_license_holder_profile_field(self):
        account = build_account(license_holder={"email_on_labor_listing": True})
        assert preference_enabled(account, "email_on_labor_listing") is True

    def test_field_missing_everywhere_returns_false(self):
        "Тумблер чужой роли: у заказчика нет email_on_order_updated — не шлём."
        account = build_account(customer={"email_on_response_created": True})
        assert preference_enabled(account, "email_on_order_updated") is False


class TestCanSend:
    "EmailDispatcher.can_send — фильтр получателей по email + per-type флагу."

    def test_no_account_returns_false(self):
        assert EmailDispatcher.can_send(None, "email_on_chat_message") is False

    def test_none_preference_requires_only_email(self):
        "preference_field=None — событие без отдельного тумблера, достаточно email."
        assert EmailDispatcher.can_send(build_account(), None) is True
        assert EmailDispatcher.can_send(build_account(email=None), None) is False

    def test_no_email_returns_false(self):
        account = build_account(email=None, email_on_chat_message=True)
        assert EmailDispatcher.can_send(account, "email_on_chat_message") is False

    def test_empty_email_returns_false(self):
        account = build_account(email="", email_on_chat_message=True)
        assert EmailDispatcher.can_send(account, "email_on_chat_message") is False

    def test_preference_off_returns_false(self):
        account = build_account(email_on_chat_message=False)
        assert EmailDispatcher.can_send(account, "email_on_chat_message") is False

    def test_all_good_returns_true(self):
        account = build_account(email_on_chat_message=True)
        assert EmailDispatcher.can_send(account, "email_on_chat_message") is True

    def test_profile_toggle_respected(self):
        "Тумблер эксперта читается из expert_profile."
        account = build_account(expert={"email_on_bidding_finished": True})
        assert EmailDispatcher.can_send(account, "email_on_bidding_finished") is True

    def test_each_field_isolated(self):
        "Флаги независимы: включённый email_on_order_updated не влияет на email_on_chat_message."
        account = build_account(
            email_on_chat_message=False,
            expert={"email_on_order_updated": True},
        )
        assert EmailDispatcher.can_send(account, "email_on_order_updated") is True
        assert EmailDispatcher.can_send(account, "email_on_chat_message") is False


class TestTelegramText:
    "telegram_text — текст письма (.txt) превращается в Telegram-сообщение без ссылок-переходов."

    CTA = "Чтобы продолжить, откройте приложение."

    def test_first_line_becomes_bold_heading(self):
        result = telegram_text("Заголовок\nТело письма", self.CTA)
        assert result == f"<b>Заголовок</b>\nТело письма\n\n{self.CTA}\n\n{SIGNATURE}"

    def test_cta_links_stripped_signature_kept(self):
        text = (
            "Заголовок\n\nТело\n\nОткрыть чат: https://plus-resurs.com/chat/abc\n\n"
            "—\nРесурс-Плюс · plus-resurs.com"
        )
        result = telegram_text(text, self.CTA)
        assert "https://" not in result.replace(SIGNATURE, "")
        assert result == f"<b>Заголовок</b>\nТело\n\n{self.CTA}\n\n{SIGNATURE}"

    def test_unsubscribe_tail_stripped(self):
        text = "Заголовок\nТело\nВы получили это письмо, так как включены уведомления."
        result = telegram_text(text, self.CTA)
        assert result == f"<b>Заголовок</b>\nТело\n\n{self.CTA}\n\n{SIGNATURE}"

    def test_user_input_escaped_for_html(self):
        result = telegram_text("Заголовок\nКомментарий: <script> & \"кавычки\"", self.CTA)
        assert "<script>" not in result
        assert "&lt;script&gt;" in result
