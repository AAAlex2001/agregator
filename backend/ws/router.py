from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ws.manager import order_manager

router = APIRouter(prefix="/ws")


@router.websocket("/orders")
async def orders_websocket(websocket: WebSocket) -> None:
    await order_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        order_manager.disconnect(websocket)
    except Exception:
        order_manager.disconnect(websocket)
