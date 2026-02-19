from typing import Any
from collections import defaultdict

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


class ChatConnectionManager:
    def __init__(self) -> None:
        self.chat_connections: dict[int, dict[int, set[WebSocket]]] = defaultdict(lambda: defaultdict(set))

    async def connect(self, chat_id: int, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.chat_connections[chat_id][user_id].add(websocket)

    def disconnect(self, chat_id: int, user_id: int, websocket: WebSocket) -> None:
        chat_users = self.chat_connections.get(chat_id)
        if not chat_users:
            return

        user_sockets = chat_users.get(user_id)
        if user_sockets:
            user_sockets.discard(websocket)
            if not user_sockets:
                chat_users.pop(user_id, None)

        if not chat_users:
            self.chat_connections.pop(chat_id, None)

    def get_online_user_ids(self, chat_id: int) -> set[int]:
        chat_users = self.chat_connections.get(chat_id)
        if not chat_users:
            return set()
        return {user_id for user_id, sockets in chat_users.items() if sockets}

    def has_two_participants(self, chat_id: int) -> bool:
        return len(self.get_online_user_ids(chat_id)) >= 2

    async def broadcast_chat(self, chat_id: int, data: dict[str, Any], require_two_participants: bool = False) -> None:
        if require_two_participants and not self.has_two_participants(chat_id):
            return

        chat_users = self.chat_connections.get(chat_id)
        if not chat_users:
            return

        stale: list[tuple[int, WebSocket]] = []
        for user_id, sockets in chat_users.items():
            for connection in sockets:
                if connection.client_state != WebSocketState.CONNECTED:
                    stale.append((user_id, connection))
                    continue
                try:
                    await connection.send_json(data)
                except Exception:
                    stale.append((user_id, connection))

        for user_id, connection in stale:
            self.disconnect(chat_id, user_id, connection)

    async def send_user(self, chat_id: int, user_id: int, data: dict[str, Any]) -> None:
        chat_users = self.chat_connections.get(chat_id)
        if not chat_users:
            return

        sockets = chat_users.get(user_id)
        if not sockets:
            return

        stale: list[WebSocket] = []
        for connection in sockets:
            if connection.client_state != WebSocketState.CONNECTED:
                stale.append(connection)
                continue
            try:
                await connection.send_json(data)
            except Exception:
                stale.append(connection)

        for connection in stale:
            self.disconnect(chat_id, user_id, connection)


chat_manager = ChatConnectionManager()
