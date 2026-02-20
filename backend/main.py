import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import login, registration, forgot_password, order, response, settings, chat, payment, review
from ws.router import router as ws_router

app = FastAPI(title="Resurs Plus API", version="1.0.0")

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
app.include_router(review.router, prefix="/api")
app.include_router(ws_router, prefix="/api")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Resurs Plus API"}

@app.get("/health")
async def health():
    return {"status": "ok"}
