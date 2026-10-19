"""Постер в Telegram без сети и базы: разметка, очередь, форма, подключение каналов и бот."""

import asyncio
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest

from app.core.telegram import TelegramReply, parse_reply
from app.poster.channels.models import PosterChannel
from app.poster.channels.services.exceptions import NotChatAdminError, TelegramNotLinkedError
from app.poster.channels.services.telegram_chats import ChatInfo, bot_can_post
from app.poster.channels.services.usecases.connect_channel import ConnectChannelUseCase
from app.poster.delivery.models import DeliveryStatus, PostDelivery
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.delivery.services.telegram_markup import telegram_length, to_telegram
from app.poster.delivery.services.usecases.send_delivery import record_outcome
from app.poster.media.models import PostMedia
from app.poster.publications.models import Post
from app.poster.publications.schemas import PostSaveSchema
from app.poster.publications.services.exceptions import (
    ChannelUnavailableError,
    NoPublicationTargetError,
    TelegramTextTooLongError,
)
from app.poster.publications.services.post_form import PostForm, sync_deliveries
from app.telegram.bot.services.keyboards import CHANNEL_RIGHTS, RIGHT_NAMES
from app.telegram.bot.services.usecases.handle_update import HandleUpdateUseCase
from models.account import Account

OWNER = Account(id=1, email="anna@mail.ru", first_name="Анна")


def channel(channel_id: int, can_post: bool = True) -> PosterChannel:
    return PosterChannel(
        id=channel_id,
        owner_id=OWNER.id,
        chat_id=-100 - channel_id,
        kind="channel",
        title=f"Канал {channel_id}",
        can_post=can_post,
        is_active=True,
    )


def test_editor_html_becomes_telegram_markup() -> None:
    html = (
        "<h2>Итоги</h2><p>Привет, <strong>мир</strong> &amp; <em>друзья</em></p>"
        "<ul><li>раз</li><li>два</li></ul><ol><li>первый</li><li>второй</li></ol>"
        '<blockquote>цитата</blockquote><p><a href="https://ya.ru">ссылка</a></p>'
    )

    text = to_telegram(html)

    assert text.startswith("<b>Итоги</b>\n\nПривет, <b>мир</b> &amp; <i>друзья</i>")
    assert "• раз\n• два" in text
    assert "1. первый\n2. второй" in text
    assert "<blockquote>цитата</blockquote>" in text
    assert '<a href="https://ya.ru">ссылка</a>' in text
    assert "\n\n\n" not in text


def test_length_is_counted_like_telegram() -> None:
    assert telegram_length("<b>ab</b> &amp;") == 4
    assert telegram_length("😀") == 2


def test_parse_reply_reads_errors_and_ignores_not_modified() -> None:
    limited = parse_reply({"ok": False, "description": "Too Many Requests", "parameters": {"retry_after": 7}})
    migrated = parse_reply({"ok": False, "description": "migrated", "parameters": {"migrate_to_chat_id": -5}})
    same = parse_reply({"ok": False, "description": "Bad Request: message is not modified"})

    assert limited.retry_after == 7
    assert migrated.migrate_to_chat_id == -5
    assert same.ok


def test_delivery_outcome_retries_then_fails() -> None:
    now = datetime(2026, 10, 19, tzinfo=UTC)
    delivery = PostDelivery(status=DeliveryStatus.SENDING, attempts=1)

    record_outcome(delivery, TelegramReply(error="сеть"), now)
    assert delivery.status == DeliveryStatus.PENDING
    assert delivery.next_attempt_at == now + timedelta(seconds=30)

    delivery.attempts = 3
    record_outcome(delivery, TelegramReply(error="сеть"), now)
    assert delivery.status == DeliveryStatus.FAILED


def test_delivery_outcome_waits_on_rate_limit_without_spending_attempt() -> None:
    now = datetime(2026, 10, 19, tzinfo=UTC)
    delivery = PostDelivery(status=DeliveryStatus.SENDING, attempts=2)

    record_outcome(delivery, TelegramReply(error="лимит", retry_after=12), now)

    assert delivery.status == DeliveryStatus.PENDING
    assert delivery.attempts == 1
    assert delivery.next_attempt_at == now + timedelta(seconds=12)


def test_delivery_outcome_saves_message_ids() -> None:
    now = datetime(2026, 10, 19, tzinfo=UTC)
    delivery = PostDelivery(status=DeliveryStatus.SENDING, attempts=1)

    record_outcome(delivery, TelegramReply(result=[10, 11]), now)

    assert delivery.status == DeliveryStatus.SENT
    assert delivery.message_ids == [10, 11]
    assert delivery.sent_at == now


class FakeMedia:
    def __init__(self, items: list[PostMedia]) -> None:
        self.items = items

    async def list_attachable(self, owner_id, media_ids, post_id):
        return [item for item in self.items if item.id in media_ids]


class FakeChannels:
    def __init__(self, items: list[PosterChannel]) -> None:
        self.items = items

    async def list_ready(self, owner_id, channel_ids):
        return [item for item in self.items if item.id in channel_ids and item.is_ready]


class NoPosts:
    async def get_by_id(self, post_id):
        return None


def fill(payload: PostSaveSchema, media=None, channels=None) -> Post:
    post = Post(author_id=OWNER.id)
    form = PostForm(FakeMedia(media or []), FakeChannels(channels or []), NoPosts())
    asyncio.run(form.fill(post, OWNER.id, payload))

    return post


def test_post_needs_site_or_channel() -> None:
    with pytest.raises(NoPublicationTargetError):
        fill(PostSaveSchema(html="<p>Текст</p>", on_site=False))


def test_channel_without_rights_is_rejected() -> None:
    with pytest.raises(ChannelUnavailableError):
        fill(PostSaveSchema(html="<p>Текст</p>", channel_ids=[1]), channels=[channel(1, can_post=False)])


def test_caption_limit_applies_with_media() -> None:
    photo = PostMedia(id=5, owner_id=OWNER.id, kind="photo", path="posts/a.jpg")
    payload = PostSaveSchema(html=f"<p>{'я' * 1100}</p>", media_ids=[5], channel_ids=[1])

    with pytest.raises(TelegramTextTooLongError, match="1100 из 1024"):
        fill(payload, media=[photo], channels=[channel(1)])


def test_telegram_only_post_gets_pending_delivery() -> None:
    post = fill(PostSaveSchema(html="<p>Текст</p>", on_site=False, channel_ids=[1]), channels=[channel(1)])

    assert post.on_site is False
    assert [delivery.channel_id for delivery in post.deliveries] == [1]


def test_sent_deliveries_stay_and_unselected_pending_go() -> None:
    post = Post(author_id=OWNER.id)
    post.deliveries = [
        PostDelivery(channel_id=1, status=DeliveryStatus.SENT),
        PostDelivery(channel_id=2, status=DeliveryStatus.PENDING),
    ]

    sync_deliveries(post, [channel(3)])

    assert [(item.channel_id, item.status) for item in post.deliveries] == [
        (1, DeliveryStatus.SENT),
        (3, None),
    ]


def test_bot_rights_in_channel_need_post_permission() -> None:
    assert bot_can_post("channel", {"status": "administrator", "can_post_messages": True})
    assert not bot_can_post("channel", {"status": "administrator"})
    assert bot_can_post("supergroup", {"status": "administrator"})
    assert not bot_can_post("group", {"status": "member"})


def test_admin_rights_list_every_required_field() -> None:
    assert set(CHANNEL_RIGHTS) == set(RIGHT_NAMES)
    assert CHANNEL_RIGHTS["can_post_messages"] is True
    assert CHANNEL_RIGHTS["can_promote_members"] is False


class FakeLinks:
    def __init__(self, account: Account | None) -> None:
        self.account = account

    async def find_by_telegram(self, telegram_id):
        return self.account


class FakeChats:
    def __init__(self, is_admin: bool, info: ChatInfo | None) -> None:
        self.admin = is_admin
        self.info = info
        self.left: list[int] = []

    async def is_admin(self, chat_id, telegram_user_id):
        return self.admin

    async def inspect(self, chat_id):
        return self.info

    async def leave(self, chat_id):
        self.left.append(chat_id)


class FakeChannelRepository:
    def __init__(self) -> None:
        self.items: list[PosterChannel] = []

    async def find(self, owner_id, chat_id):
        found = [item for item in self.items if item.owner_id == owner_id and item.chat_id == chat_id]
        return found[0] if found else None

    async def add(self, item):
        self.items.append(item)

    async def save(self):
        return None

    async def list_by_chat(self, chat_id):
        return [item for item in self.items if item.chat_id == chat_id]

    async def count_by_chat(self, chat_id):
        return len(await self.list_by_chat(chat_id))


INFO = ChatInfo(kind="channel", title="Новости", username="news", members_count=10, can_post=True)


def test_only_chat_admin_can_connect() -> None:
    usecase = ConnectChannelUseCase(FakeChannelRepository(), FakeLinks(OWNER), FakeChats(False, INFO))

    with pytest.raises(NotChatAdminError):
        asyncio.run(usecase.execute(telegram_user_id=7, chat_id=-100))


def test_unlinked_telegram_cannot_connect() -> None:
    usecase = ConnectChannelUseCase(FakeChannelRepository(), FakeLinks(None), FakeChats(True, INFO))

    with pytest.raises(TelegramNotLinkedError):
        asyncio.run(usecase.execute(telegram_user_id=7, chat_id=-100))


def test_new_channel_is_ready_once() -> None:
    channels = FakeChannelRepository()
    usecase = ConnectChannelUseCase(channels, FakeLinks(OWNER), FakeChats(True, INFO))

    first = asyncio.run(usecase.execute(telegram_user_id=7, chat_id=-100))
    second = asyncio.run(usecase.execute(telegram_user_id=7, chat_id=-100))

    assert first.became_ready is True
    assert second.became_ready is False
    assert len(channels.items) == 1
    assert channels.items[0].title == "Новости"


class FakeApi:
    bot_id = 99

    def __init__(self) -> None:
        self.calls: list[tuple[str, dict]] = []
        self.uploads: list[tuple[str, dict, dict[str, Path]]] = []

    async def call(self, method, payload):
        self.calls.append((method, payload))
        return TelegramReply(result={"message_id": 1})

    async def upload(self, method, payload, files):
        self.uploads.append((method, payload, files))
        return TelegramReply(result=[{"message_id": 1}, {"message_id": 2}])


class FakeLink:
    def __init__(self, account: Account | None) -> None:
        self.account = account

    async def execute(self, token, telegram_id):
        return self.account if token == "good" else None


class FakeAccess:
    def __init__(self) -> None:
        self.updates: list[tuple[int, str]] = []

    async def execute(self, chat_id, bot_status):
        self.updates.append((chat_id, bot_status))


class FakeHidden:
    def __init__(self) -> None:
        self.callbacks: list[dict] = []

    async def execute(self, callback):
        self.callbacks.append(callback)


def bot(api: FakeApi, connect=None, access=None, chats=None, hidden=None) -> HandleUpdateUseCase:
    return HandleUpdateUseCase(
        api=api,
        link=FakeLink(OWNER),
        connect=connect or ConnectChannelUseCase(FakeChannelRepository(), FakeLinks(None), FakeChats(True, INFO)),
        access=access or FakeAccess(),
        hidden=hidden or FakeHidden(),
        channels=FakeChannelRepository(),
        chats=chats or FakeChats(True, INFO),
    )


def private_message(text: str = "", **extra) -> dict:
    return {"message": {"chat": {"type": "private", "id": 7}, "from": {"id": 7}, "text": text, **extra}}


def test_start_with_link_token_shows_connect_buttons() -> None:
    api = FakeApi()

    asyncio.run(bot(api).execute(private_message("/start good")))

    method, payload = api.calls[0]
    assert method == "sendMessage"
    assert "привязан" in payload["text"]
    assert payload["reply_markup"]["keyboard"][0][0]["request_chat"]["chat_is_channel"] is True


def test_expired_link_is_reported() -> None:
    api = FakeApi()

    asyncio.run(bot(api).execute(private_message("/start old")))

    assert "устарела" in api.calls[0][1]["text"]


def test_chat_shared_by_unlinked_user_explains_what_to_do() -> None:
    api = FakeApi()

    asyncio.run(bot(api).execute(private_message(chat_shared={"chat_id": -100, "request_id": 1})))

    assert "Подключить канал" in api.calls[0][1]["text"]


def test_bot_removed_from_chat_turns_connections_off() -> None:
    api = FakeApi()
    access = FakeAccess()
    update = {
        "my_chat_member": {
            "chat": {"id": -100, "type": "channel"},
            "from": {"id": 7},
            "new_chat_member": {"status": "kicked"},
        }
    }

    asyncio.run(bot(api, access=access).execute(update))

    assert access.updates == [(-100, "kicked")]
    assert api.calls == []


def test_bot_added_by_stranger_leaves_unconnected_chat() -> None:
    chats = FakeChats(False, INFO)
    connect = ConnectChannelUseCase(FakeChannelRepository(), FakeLinks(OWNER), chats)
    update = {
        "my_chat_member": {
            "chat": {"id": -100, "type": "supergroup"},
            "from": {"id": 7},
            "new_chat_member": {"status": "member"},
        }
    }

    asyncio.run(bot(FakeApi(), connect=connect, chats=chats).execute(update))

    assert chats.left == [-100]


def test_album_goes_as_media_group_with_caption_on_first() -> None:
    api = FakeApi()
    post = Post(html="<p>Подпись</p>")
    post.media = [
        PostMedia(id=1, kind="photo", path="posts/a.jpg"),
        PostMedia(id=2, kind="video", path="posts/b.mp4"),
    ]

    reply = asyncio.run(TelegramPublisher(api).send(post, -100))

    method, payload, files = api.uploads[0]
    assert method == "sendMediaGroup"
    assert payload["media"][0]["caption"] == "Подпись"
    assert "caption" not in payload["media"][1]
    assert list(files) == ["file0", "file1"]
    assert reply.result == [1, 2]


def test_text_post_goes_as_message() -> None:
    api = FakeApi()
    post = Post(html="<p>Текст</p>")
    post.media = []

    reply = asyncio.run(TelegramPublisher(api).send(post, -100))

    assert api.calls[0][0] == "sendMessage"
    assert api.calls[0][1]["text"] == "Текст"
    assert reply.result == [1]
