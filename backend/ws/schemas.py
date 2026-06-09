from typing import Any

from pydantic import BaseModel, ConfigDict


class ChatBroadcastPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    chat_id: int
    data: dict[str, Any]


class ExpertRoomBroadcastPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    data: dict[str, Any]
    except_connection_id: str | None = None
