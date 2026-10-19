"""Настройки Telegram-поста без сети и базы: проверки, запросы, расписание, скрытые кнопки."""

import asyncio
from datetime import UTC, datetime, timedelta

import pytest
from pydantic import ValidationError

from app.core.telegram import TelegramReply, message_link
from app.poster.delivery.models import DeliveryStatus, PostDelivery
from app.poster.delivery.options import TelegramButton, TelegramOptions, TelegramPoll
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.delivery.services.telegram_payloads import (
    hidden_callback,
    inline_keyboard,
    link_preview_options,
    parse_hidden_callback,
)
from app.poster.delivery.services.usecases.send_delivery import record_outcome
from app.poster.delivery.services.usecases.show_hidden_text import SUBSCRIBERS_ONLY, ShowHiddenTextUseCase
from app.poster.media.models import PostMedia
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.schemas import PostSaveSchema
from app.poster.publications.services.exceptions import ButtonsInAlbumError, ScheduleInPastError
from app.poster.publications.services.post_form import check_buttons, check_schedule, next_status

NOW = datetime(2026, 10, 19, 12, tzinfo=UTC)


def button(kind: str, value: str, **extra) -> TelegramButton:
    return TelegramButton(kind=kind, text="Кнопка", value=value, **extra)


def test_url_button_needs_http_link() -> None:
    with pytest.raises(ValidationError, match="https://"):
        button("url", "ftp://site")


def test_row_holds_at_most_three_buttons() -> None:
    row = [button("url", "https://a.ru") for index in range(4)]

    with pytest.raises(ValidationError, match="от 1 до 3"):
        TelegramOptions(buttons=[row])


def test_auto_delete_is_chosen_from_list() -> None:
    with pytest.raises(ValidationError, match="автоудаления"):
        TelegramOptions(auto_delete_hours=5)


def test_poll_needs_two_options() -> None:
    with pytest.raises(ValidationError):
        TelegramPoll(question="Как дела?", options=["Хорошо"])


def test_options_of_old_post_are_defaults() -> None:
    options = TelegramOptions.of({})

    assert options.silent is False
    assert options.buttons == []


def test_keyboard_has_url_copy_and_hidden_buttons() -> None:
    options = TelegramOptions(
        buttons=[
            [button("url", "https://a.ru", style="success"), button("copy", "PROMO")],
            [button("hidden", "Секрет", alt="Подпишитесь")],
        ]
    )

    keyboard = inline_keyboard(7, options)["inline_keyboard"]

    assert keyboard[0][0] == {"text": "Кнопка", "style": "success", "url": "https://a.ru"}
    assert keyboard[0][1]["copy_text"] == {"text": "PROMO"}
    assert keyboard[1][0]["callback_data"] == "hidden:7:1:0"


def test_hidden_callback_round_trip() -> None:
    assert parse_hidden_callback(hidden_callback(12, 0, 2)) == (12, 0, 2)
    assert parse_hidden_callback("hidden:x:0:0") is None
    assert parse_hidden_callback("other") is None


def test_link_preview_variants() -> None:
    assert link_preview_options(TelegramOptions()) is None
    assert link_preview_options(TelegramOptions(link_preview="off")) == {"is_disabled": True}
    assert link_preview_options(TelegramOptions(link_preview="large", link_preview_above=True)) == {
        "prefer_large_media": True,
        "show_above_text": True,
    }


def test_buttons_are_not_allowed_on_album() -> None:
    options = TelegramOptions(buttons=[[button("url", "https://a.ru")]])

    check_buttons(options, 1)
    with pytest.raises(ButtonsInAlbumError):
        check_buttons(options, 2)


def test_schedule_must_be_in_future() -> None:
    check_schedule(NOW + timedelta(minutes=5), NOW)

    with pytest.raises(ScheduleInPastError):
        check_schedule(NOW - timedelta(minutes=1), NOW)


@pytest.mark.parametrize(
    ("current", "draft", "scheduled", "expected"),
    [
        (PostStatus.DRAFT, False, None, PostStatus.PUBLISHED),
        (PostStatus.DRAFT, False, NOW, PostStatus.SCHEDULED),
        (PostStatus.SCHEDULED, True, NOW, PostStatus.DRAFT),
        (PostStatus.PUBLISHED, False, NOW, PostStatus.PUBLISHED),
        (PostStatus.HIDDEN, False, None, PostStatus.HIDDEN),
    ],
)
def test_next_status(current, draft, scheduled, expected) -> None:
    payload = PostSaveSchema(html="<p>Текст</p>", draft=draft, scheduled_at=scheduled)

    assert next_status(Post(status=current), payload) == expected


def test_sent_delivery_gets_delete_time() -> None:
    delivery = PostDelivery(status=DeliveryStatus.SENDING, attempts=1)

    record_outcome(delivery, TelegramReply(result=[5]), NOW, auto_delete_hours=24)

    assert delivery.delete_at == NOW + timedelta(hours=24)


class FakeApi:
    def __init__(self, member_status: str = "member") -> None:
        self.calls: list[tuple[str, dict]] = []
        self.member_status = member_status

    async def call(self, method, payload):
        self.calls.append((method, payload))
        if method == "getChatMember":
            return TelegramReply(result={"status": self.member_status})
        return TelegramReply(result={"message_id": len(self.calls)})

    async def upload(self, method, payload, files):
        self.calls.append((method, payload))
        return TelegramReply(result={"message_id": 1})


def telegram_post(**options) -> Post:
    post = Post(id=3, html="<p>Привет</p>", telegram=TelegramOptions(**options).model_dump(mode="json"))
    post.media = []

    return post


def test_text_post_goes_silent_with_buttons_poll_and_pin() -> None:
    api = FakeApi()
    post = telegram_post(
        silent=True,
        protect=True,
        pin=True,
        buttons=[[button("url", "https://a.ru")]],
        poll=TelegramPoll(question="Да?", options=["Да", "Нет"]),
    )

    reply = asyncio.run(TelegramPublisher(api).send(post, -100))

    methods = [method for method, payload in api.calls]
    message = api.calls[0][1]
    assert methods == ["sendMessage", "sendPoll", "pinChatMessage"]
    assert message["disable_notification"] is True
    assert message["protect_content"] is True
    assert message["reply_markup"]["inline_keyboard"][0][0]["url"] == "https://a.ru"
    assert api.calls[2][1]["message_id"] == 1
    assert reply.result == [1, 2]


def test_single_photo_can_show_caption_above() -> None:
    api = FakeApi()
    post = telegram_post(caption_above=True)
    post.media = [PostMedia(id=1, kind="photo", path="posts/a.jpg")]

    asyncio.run(TelegramPublisher(api).send(post, -100))

    method, payload = api.calls[0]
    assert method == "sendPhoto"
    assert payload["show_caption_above_media"] is True
    assert "reply_markup" not in payload


class FakePosts:
    def __init__(self, post: Post | None) -> None:
        self.post = post

    async def get_by_id(self, post_id):
        return self.post


def press(member_status: str, data: str = "hidden:3:0:0") -> str:
    api = FakeApi(member_status)
    post = telegram_post(buttons=[[button("hidden", "Промокод SALE")]])
    callback = {"id": "q1", "data": data, "from": {"id": 7}, "message": {"chat": {"id": -100}}}

    asyncio.run(ShowHiddenTextUseCase(FakePosts(post), api).execute(callback))

    return api.calls[-1][1]["text"]


def test_hidden_text_is_shown_to_subscribers_only() -> None:
    assert press("member") == "Промокод SALE"
    assert press("left") == SUBSCRIBERS_ONLY
    assert press("member", data="hidden:3:5:0") == "Кнопка больше не работает"


def test_message_link_for_public_private_and_group_chats() -> None:
    assert message_link(-1001234, "news", 7) == "https://t.me/news/7"
    assert message_link(-1001234, None, 7) == "https://t.me/c/1234/7"
    assert message_link(-5678, None, 7) is None


def test_reply_post_goes_as_reply_and_survives_deleted_original() -> None:
    api = FakeApi()

    asyncio.run(TelegramPublisher(api).send(telegram_post(), -100, reply_to=42))

    assert api.calls[0][1]["reply_parameters"] == {"message_id": 42, "allow_sending_without_reply": True}
