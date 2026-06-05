from dataclasses import dataclass
from typing import Any
from uuid import uuid4

from fastapi import WebSocket
from pydantic import BaseModel
from starlette.websockets import WebSocketState

from ws.pubsub import ws_pubsub

EXPERT_ROOM_CHANNEL = "ws:expert_room:events"


@dataclass(frozen=True)
class ExpertRoomConnection:
    user_id: int
    user_name: str
    connection_id: str


class ExpertRoomConnectionManager:
    "WebSocket-менеджер общего чата экспертов. Broadcast через Redis pub/sub с фильтрацией по connection_id."

    def __init__(self) -> None:
        self.connections: dict[WebSocket, ExpertRoomConnection] = {}

    async def connect(self, ws: WebSocket, user_id: int, user_name: str) -> None:
        await ws.accept()
        self.connections[ws] = ExpertRoomConnection(
            user_id=user_id,
            user_name=user_name,
            connection_id=uuid4().hex,
        )

    def disconnect(self, ws: WebSocket) -> None:
        self.connections.pop(ws, None)

    def get(self, ws: WebSocket) -> ExpertRoomConnection | None:
        return self.connections.get(ws)

    async def broadcast(self, event: BaseModel, except_ws: WebSocket | None = None) -> None:
        "Публикует событие в Redis. except_ws исключается локально на всех репликах по connection_id."
        payload = event.model_dump(mode="json")
        except_connection_id: str | None = None
        if except_ws is not None:
            conn = self.connections.get(except_ws)
            if conn is not None:
                except_connection_id = conn.connection_id
        await ws_pubsub.publish(
            EXPERT_ROOM_CHANNEL,
            {"data": payload, "except_connection_id": except_connection_id},
        )

    async def handle_event(self, payload: dict[str, Any]) -> None:
        "Хендлер pubsub-канала: рассылает событие по локальным сокетам, пропуская connection_id отправителя."
        data = payload.get("data")
        if not isinstance(data, dict):
            return
        except_connection_id = payload.get("except_connection_id")
        await self.local_broadcast(data, except_connection_id=except_connection_id)

    async def local_broadcast(
        self,
        data: dict[str, Any],
        except_connection_id: str | None = None,
    ) -> None:
        "Прямая рассылка по сокетам, которые в памяти этой реплики."
        stale: list[WebSocket] = []
        for ws, conn in list(self.connections.items()):
            if except_connection_id is not None and conn.connection_id == except_connection_id:
                continue
            if ws.client_state != WebSocketState.CONNECTED:
                stale.append(ws)
                continue
            try:
                await ws.send_json(data)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self.disconnect(ws)


expert_room_manager = ExpertRoomConnectionManager()
