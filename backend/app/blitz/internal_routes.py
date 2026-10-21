"""Блиц-эксперт в админке за внутренним токеном: заявки, счета, цены и файлы."""

from fastapi import APIRouter, Depends

from app.auth.internal.dependencies import require_internal_token
from app.blitz.billing.internal_routes import router as billing_router
from app.blitz.documents.internal_routes import router as documents_router
from app.blitz.orders.internal_routes import router as orders_router
from app.blitz.pricing.internal_routes import router as pricing_router

PREFIX = "/internal/blitz"

router = APIRouter(dependencies=[Depends(require_internal_token)])

for subrouter in (orders_router, billing_router, pricing_router, documents_router):
    router.include_router(subrouter, prefix=PREFIX)
