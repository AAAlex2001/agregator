from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from models.account import UserRole
from services.email.use_cases.send_feature_launch_email import SendFeatureLaunchEmailUseCase

MODULE = "services.email.use_cases.send_feature_launch_email"


@pytest.mark.parametrize(
    ("role", "expected", "absent"),
    [
        (UserRole.CUSTOMER, "https://plus-resurs.com/blitz-audit/new", "Конкурсная комиссия"),
        (UserRole.EXPERT, "https://plus-resurs.com/commission", "Создать заявку на экспертизу"),
    ],
)
async def test_each_role_gets_its_own_letter(role: UserRole, expected: str, absent: str) -> None:
    use_case = SendFeatureLaunchEmailUseCase(MagicMock(), role)

    with patch(f"{MODULE}.send_email", new=AsyncMock()) as send_email:
        assert await use_case.send("ivan@example.com", "Иван")

    email, _subject, text, html = send_email.call_args.args
    assert email == "ivan@example.com"
    assert "Здравствуйте, Иван!" in html
    assert expected in html
    assert expected in text
    assert absent not in html


async def test_recipients_are_taken_by_role_and_failures_do_not_stop_mailing() -> None:
    repo = MagicMock()
    repo.list_announcement_recipients = AsyncMock(
        return_value=[
            SimpleNamespace(email="a@example.com", first_name="А"),
            SimpleNamespace(email="b@example.com", first_name=None),
        ]
    )
    use_case = SendFeatureLaunchEmailUseCase(repo, UserRole.CUSTOMER)

    with patch(f"{MODULE}.send_email", new=AsyncMock(side_effect=[RuntimeError("smtp"), None])):
        assert await use_case.execute() == 1

    repo.list_announcement_recipients.assert_awaited_once_with(UserRole.CUSTOMER, None, True)
