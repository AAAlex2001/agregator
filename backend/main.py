import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import login, registration, forgot_password, order, response, settings, chat, payment, pricing, review, notification, landing, question, support, license_holder, report, article, expert
from ws.router import router as ws_router
from ws.manager import CHAT_CHANNEL, chat_manager
from ws.expert_room_manager import EXPERT_ROOM_CHANNEL, expert_room_manager
from ws.pubsub import ws_pubsub
from tasks.auto_reject import run_auto_reject_loop


@asynccontextmanager
async def lifespan(application: FastAPI):
    ws_pubsub.register(CHAT_CHANNEL, chat_manager.handle_event)
    ws_pubsub.register(EXPERT_ROOM_CHANNEL, expert_room_manager.handle_event)
    await ws_pubsub.start()
    auto_reject_task = asyncio.create_task(run_auto_reject_loop())
    yield
    auto_reject_task.cancel()
    await ws_pubsub.stop()


app = FastAPI(title="Resurs Plus API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://plus-resurs.com",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router, prefix="/api")
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
app.include_router(question.router, prefix="/api")
app.include_router(support.router, prefix="/api")
app.include_router(license_holder.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(article.router, prefix="/api")
app.include_router(expert.router, prefix="/api")
app.include_router(chat.expert_room_router, prefix="/api")
app.include_router(ws_router, prefix="/api")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Resurs Plus API"}

@app.get("/health")
async def health():
    return {"status": "ok"}
