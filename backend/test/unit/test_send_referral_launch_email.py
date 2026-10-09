from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from services.email.formatting import format_pluses
from services.email.use_cases.send_referral_launch_email import SendReferralLaunchEmailUseCase

MODULE = "services.email.use_cases.send_referral_launch_email"


@pytest.mark.parametrize(
    ("amount", "expected"),
    [
        (1, "1 плюс"),
        (3, "3 плюса"),
        (11, "11 плюсов"),
        (21, "21 плюс"),
        (3_000, "3 000 плюсов"),
        (1_000_000, "1 000 000 плюсов"),
    ],
)
def test_pluses_are_declined(amount: int, expected: str) -> None:
    assert format_pluses(amount).replace(" ", " ") == expected


async def test_letter_has_amounts_cta_and_one_click_unsubscribe() -> None:
    use_case = SendReferralLaunchEmailUseCase(MagicMock(), 3_000, 1_000_000)

    with patch(f"{MODULE}.send_email", new=AsyncMock()) as send_email:
        assert await use_case.send("ivan@example.com", "Иван")

    email, subject, text, html = send_email.call_args.args
    headers = send_email.call_args.kwargs["headers"]
    assert email == "ivan@example.com"
    assert "3 000 плюсов" in subject
    assert "1 000 000 плюсов" in html
    assert "Иван, приглашайте" in html
    assert "https://plus-resurs.com/settings" in text
    assert "/api/email/unsubscribe?token=" in html
    assert headers["List-Unsubscribe-Post"] == "List-Unsubscribe=One-Click"


async def test_failed_address_does_not_stop_mailing() -> None:
    repo = MagicMock()
    repo.list_experts_for_announcement = AsyncMock(
        return_value=[
            SimpleNamespace(email="a@example.com", first_name="А"),
            SimpleNamespace(email="b@example.com", first_name=None),
        ]
    )
    use_case = SendReferralLaunchEmailUseCase(repo, 3_000, 1_000_000)

    with patch(f"{MODULE}.send_email", new=AsyncMock(side_effect=[RuntimeError("smtp"), None])):
        assert await use_case.execute() == 1
