from dataclasses import dataclass

from fastapi import WebSocket
from pydantic import BaseModel
from starlette.websockets import WebSocketState


@dataclass(frozen=True)
class ExpertRoomConnection:
    user_id: int
    user_name: str


class ExpertRoomConnectionManager:
    """Один общий канал — все подключённые эксперты получают broadcast."""

    def __init__(self) -> None:
        self.connections: dict[WebSocket, ExpertRoomConnection] = {}

    async def connect(self, ws: WebSocket, user_id: int, user_name: str) -> None:
        await ws.accept()
        self.connections[ws] = ExpertRoomConnection(user_id=user_id, user_name=user_name)

    def disconnect(self, ws: WebSocket) -> None:
        self.connections.pop(ws, None)

    def get(self, ws: WebSocket) -> ExpertRoomConnection | None:
        return self.connections.get(ws)

    async def broadcast(self, event: BaseModel, except_ws: WebSocket | None = None) -> None:
        payload = event.model_dump(mode="json")
        stale: list[WebSocket] = []
        for conn, _ in list(self.connections.items()):
            if conn is except_ws:
                continue
            if conn.client_state != WebSocketState.CONNECTED:
                stale.append(conn)
                continue
            try:
                await conn.send_json(payload)
            except Exception:
                stale.append(conn)
        for conn in stale:
            self.disconnect(conn)


expert_room_manager = ExpertRoomConnectionManager()
