from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from models.response import ResponseStatus
from models.account import UserRole
from services.email.use_cases.send_bidding_finished_email import OUTCOME_LOST, OUTCOME_WON
from services.responses.use_cases.update_response_status import UpdateResponseStatusUseCase


def build_use_case(send_bidding_email=None):
    "Собирает use case с моками всех зависимостей, возвращает (use_case, mocks)."
    repo = MagicMock()
    validator = MagicMock()
    rules = MagicMock()
    get_response = MagicMock()
    in_app = MagicMock()
    return (
        UpdateResponseStatusUseCase(
            repo=repo,
            validator=validator,
            rules=rules,
            get_response=get_response,
            in_app=in_app,
            send_bidding_email=send_bidding_email,
        ),
        SimpleNamespace(
            repo=repo, validator=validator, rules=rules,
            get_response=get_response, in_app=in_app,
        ),
    )


@pytest.mark.asyncio
class TestBiddingFanOut:
    "Заказчик переводит отклик в IN_PROGRESS → победителю 'won', отклонённым 'lost'."

    async def test_winner_gets_won_and_losers_get_lost(self):
        send_email = MagicMock()
        send_email.execute = AsyncMock()
        use_case, _ = build_use_case(send_bidding_email=send_email)

        customer = SimpleNamespace(id=1, role=UserRole.CUSTOMER)
        winner_response = SimpleNamespace(id=5, expert_id=42, order_id=7)
        auto_rejected_ids = [100, 101, 102]

        await use_case.send_bidding_emails_on_selection(
            actor=customer,
            response=winner_response,
            new_status=ResponseStatus.IN_PROGRESS,
            auto_rejected_ids=auto_rejected_ids,
        )

        # Всего 4 вызова: 1 winner + 3 loser
        assert send_email.execute.call_count == 4
        all_calls = send_email.execute.call_args_list

        won_calls = [c for c in all_calls if c.args[2] == OUTCOME_WON]
        lost_calls = [c for c in all_calls if c.args[2] == OUTCOME_LOST]

        assert len(won_calls) == 1
        assert won_calls[0].args == (42, 7, OUTCOME_WON)

        assert len(lost_calls) == 3
        lost_expert_ids = [c.args[0] for c in lost_calls]
        assert sorted(lost_expert_ids) == [100, 101, 102]

    async def test_expert_action_does_not_trigger_bidding(self):
        "Эксперт сам переводит в IN_PROGRESS (confirm) — торгов тут нет, письма не шлём."
        send_email = MagicMock()
        send_email.execute = AsyncMock()
        use_case, _ = build_use_case(send_bidding_email=send_email)

        expert = SimpleNamespace(id=42, role=UserRole.EXPERT)
        await use_case.send_bidding_emails_on_selection(
            actor=expert,
            response=SimpleNamespace(expert_id=42, order_id=7),
            new_status=ResponseStatus.IN_PROGRESS,
            auto_rejected_ids=[],
        )
        send_email.execute.assert_not_called()

    async def test_accepted_does_not_trigger_bidding(self):
        "CUSTOMER → ACCEPTED это ещё не финал торгов (может вернуть). Письма шлём только на IN_PROGRESS."
        send_email = MagicMock()
        send_email.execute = AsyncMock()
        use_case, _ = build_use_case(send_bidding_email=send_email)

        customer = SimpleNamespace(id=1, role=UserRole.CUSTOMER)
        await use_case.send_bidding_emails_on_selection(
            actor=customer,
            response=SimpleNamespace(expert_id=42, order_id=7),
            new_status=ResponseStatus.ACCEPTED,
            auto_rejected_ids=[],
        )
        send_email.execute.assert_not_called()

    async def test_without_email_dep_no_crash(self):
        "send_bidding_email=None — use case должен молча пропустить отправку."
        use_case, _ = build_use_case(send_bidding_email=None)

        customer = SimpleNamespace(id=1, role=UserRole.CUSTOMER)
        # Не должен выкинуть исключений
        await use_case.send_bidding_emails_on_selection(
            actor=customer,
            response=SimpleNamespace(expert_id=42, order_id=7),
            new_status=ResponseStatus.IN_PROGRESS,
            auto_rejected_ids=[100, 101],
        )
