import asyncio
import logging
import os
import uuid
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import Response

from routes import (
    admin_contact_deal,
    admin_content,
    article,
    article_interactions,
    chat,
    contact_deal,
    email,
    expert,
    expert_contact,
    forgot_password,
    geo,
    hazard,
    internal,
    labor,
    landing,
    license_holder,
    lining,
    login,
    notification,
    order,
    payment,
    pricing,
    question,
    registration,
    report,
    response,
    review,
    settings,
    support,
    telegram_auth,
)
from services.techexpert.service import router as techexpert_router
from tasks.auto_reject import run_auto_reject_loop
from utils.redis_sliding_window import redis_sliding_window
from utils.request_context import request_id_var
from ws.expert_room_manager import EXPERT_ROOM_CHANNEL, expert_room_manager
from ws.manager import CHAT_CHANNEL, chat_manager
from ws.pubsub import ws_pubsub
from ws.router import router as ws_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    ws_pubsub.register(CHAT_CHANNEL, chat_manager.handle_event)
    ws_pubsub.register(EXPERT_ROOM_CHANNEL, expert_room_manager.handle_event)
    await ws_pubsub.start()
    await redis_sliding_window.start()
    auto_reject_task = asyncio.create_task(run_auto_reject_loop())
    yield
    auto_reject_task.cancel()
    await redis_sliding_window.stop()
    await ws_pubsub.stop()


app = FastAPI(title="Resurs Plus API", version="1.0.0", lifespan=lifespan)


cors_origins_env = os.getenv("CORS_ORIGINS", "https://plus-resurs.com,http://localhost:3000")
cors_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_id_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    "Прокидывает X-Request-ID: из заголовка или генерит UUID4; кладёт в state и contextvar."
    incoming = request.headers.get("X-Request-ID")
    request_id = incoming if incoming else uuid.uuid4().hex
    request.state.request_id = request_id
    request_id_var.set(request_id)
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

app.include_router(login.router, prefix="/api")
app.include_router(telegram_auth.router, prefix="/api")
app.include_router(registration.router, prefix="/api")
app.include_router(forgot_password.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(response.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(payment.router, prefix="/api")
app.include_router(pricing.router, prefix="/api")
app.include_router(review.router, prefix="/api")
app.include_router(notification.router, prefix="/api")
app.include_router(landing.router, prefix="/api")
app.include_router(labor.router, prefix="/api")
app.include_router(contact_deal.router, prefix="/api")
app.include_router(question.router, prefix="/api")
app.include_router(support.router, prefix="/api")
app.include_router(license_holder.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(hazard.router, prefix="/api")
app.include_router(lining.router, prefix="/api")
app.include_router(article.router, prefix="/api")
app.include_router(article_interactions.router, prefix="/api")
app.include_router(admin_content.router, prefix="/api")
app.include_router(admin_contact_deal.router, prefix="/api")
app.include_router(email.router, prefix="/api")
app.include_router(expert.router, prefix="/api")
app.include_router(expert_contact.router, prefix="/api")
app.include_router(geo.router, prefix="/api")
app.include_router(chat.expert_room_router, prefix="/api")
app.include_router(internal.router, prefix="/api")
app.include_router(ws_router, prefix="/api")
app.include_router(techexpert_router, prefix="/api")
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root() -> dict[str, str]:
    "Корень: лёгкий ответ-маркер, что бэк жив."
    return {"message": "Resurs Plus API"}


@app.get("/health")
async def health() -> dict[str, str]:
    "Health-check для оркестратора/балансировщика."
    return {"status": "ok"}
