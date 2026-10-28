from pydantic import BaseModel, ConfigDict

from src.poster.channels.models import ChannelKind


class ChannelResponse(BaseModel):
    """Подключённый канал: название, участники и может ли бот туда публиковать."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    kind: ChannelKind
    title: str
    username: str | None
    members_count: int | None
    can_post: bool
    is_active: bool
