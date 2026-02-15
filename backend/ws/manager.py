from typing import Any

from fastapi import WebSocket
from starlette.websockets import WebSocketState


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.connections.discard(websocket)

    async def broadcast(self, data: dict[str, Any]) -> None:
        stale: list[WebSocket] = []
        for connection in self.connections:
            if connection.client_state != WebSocketState.CONNECTED:
                stale.append(connection)
                continue
            try:
                await connection.send_json(data)
            except Exception:
                stale.append(connection)
        for connection in stale:
            self.connections.discard(connection)


order_manager = ConnectionManager()
