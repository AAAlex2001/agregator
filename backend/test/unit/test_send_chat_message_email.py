from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest

from services.email.use_cases.send_chat_message_email import SendChatMessageEmailUseCase


def make_chat_message(customer_id=10, expert_id=20, sender_id=10, text="привет"):
    customer = SimpleNamespace(
        id=customer_id,
        email="customer@test.ru",
        email_on_chat_message=True,
        first_name="Иван",
        last_name="Иванов",
    )
    expert = SimpleNamespace(
        id=expert_id,
        email="expert@test.ru",
        email_on_chat_message=True,
        first_name="Пётр",
        last_name="Петров",
    )
    order = SimpleNamespace(title="Тест-заказ")
    chat = SimpleNamespace(
        uuid=uuid4(),
        customer_id=customer_id,
        expert_id=expert_id,
        customer=customer,
        expert=expert,
        order=order,
    )
    sender = customer if sender_id == customer_id else expert
    return SimpleNamespace(
        id=1,
        sender_id=sender_id,
        sender=sender,
        text=text,
        chat=chat,
    )


@pytest.mark.asyncio
class TestSendChatMessageEmail:
    "Проверки: early-return при online, фильтр по флагу, выбор получателя."

    async def test_online_recipient_skips_email(self):
        repo = MagicMock()
        repo.find_message = AsyncMock()
        dispatcher = MagicMock()

        use_case = SendChatMessageEmailUseCase(repo=repo, dispatcher=dispatcher)
        await use_case.execute(message_id=1, recipient_online=True)

        repo.find_message.assert_not_called()
        dispatcher.dispatch.assert_not_called()

    async def test_missing_message_skips(self):
        repo = MagicMock()
        repo.find_message = AsyncMock(return_value=None)
        dispatcher = MagicMock()

        use_case = SendChatMessageEmailUseCase(repo=repo, dispatcher=dispatcher)
        await use_case.execute(message_id=999, recipient_online=False)

        dispatcher.dispatch.assert_not_called()

    async def test_customer_sends_to_expert(self):
        message = make_chat_message(sender_id=10)  # customer отправил
        repo = MagicMock()
        repo.find_message = AsyncMock(return_value=message)

        dispatcher = MagicMock()
        dispatcher.can_send = MagicMock(return_value=True)

        use_case = SendChatMessageEmailUseCase(repo=repo, dispatcher=dispatcher)
        await use_case.execute(message_id=1, recipient_online=False)

        dispatcher.dispatch.assert_called_once()
        called_email = dispatcher.dispatch.call_args[0][0]
        assert called_email == "expert@test.ru"

    async def test_expert_sends_to_customer(self):
        message = make_chat_message(sender_id=20)  # expert отправил
        repo = MagicMock()
        repo.find_message = AsyncMock(return_value=message)

        dispatcher = MagicMock()
        dispatcher.can_send = MagicMock(return_value=True)

        use_case = SendChatMessageEmailUseCase(repo=repo, dispatcher=dispatcher)
        await use_case.execute(message_id=1, recipient_online=False)

        called_email = dispatcher.dispatch.call_args[0][0]
        assert called_email == "customer@test.ru"

    async def test_disabled_preference_skips(self):
        message = make_chat_message()
        message.chat.expert.email_on_chat_message = False

        repo = MagicMock()
        repo.find_message = AsyncMock(return_value=message)

        dispatcher = MagicMock()
        dispatcher.can_send = MagicMock(return_value=False)

        use_case = SendChatMessageEmailUseCase(repo=repo, dispatcher=dispatcher)
        await use_case.execute(message_id=1, recipient_online=False)

        dispatcher.dispatch.assert_not_called()

    async def test_long_text_truncated_in_preview(self):
        long_text = "а" * 500
        message = make_chat_message(text=long_text)
        repo = MagicMock()
        repo.find_message = AsyncMock(return_value=message)

        dispatcher = MagicMock()
        dispatcher.can_send = MagicMock(return_value=True)

        use_case = SendChatMessageEmailUseCase(repo=repo, dispatcher=dispatcher)
        await use_case.execute(message_id=1, recipient_online=False)

        context = dispatcher.dispatch.call_args[0][3]
        assert len(context.message_preview) <= 241   # 240 + "…"
        assert context.message_preview.endswith("…")
