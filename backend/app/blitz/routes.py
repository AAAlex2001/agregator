"""Блиц-эксперт в кабинете: заявки, договор, работа, оплата, файлы и тарифы."""

from fastapi import APIRouter

from app.blitz.billing.routes import router as billing_router
from app.blitz.contracts.routes import router as contracts_router
from app.blitz.documents.routes import router as documents_router
from app.blitz.orders.routes import router as orders_router
from app.blitz.payments.routes import router as payments_router
from app.blitz.pricing.routes import router as pricing_router
from app.blitz.work.routes import router as work_router

PREFIX = "/blitz"

router = APIRouter()

for subrouter in (
    orders_router,
    contracts_router,
    work_router,
    billing_router,
    payments_router,
    documents_router,
    pricing_router,
):
    router.include_router(subrouter, prefix=PREFIX)
