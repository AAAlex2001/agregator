"Корень FastAPI-приложения админки: монтирует action-роуты, регистрирует все ModelView/BaseView."

import logging
import os
from collections.abc import Awaitable, Callable
from datetime import UTC, datetime

from fastapi import FastAPI, Request
from sqladmin import Admin
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import Response

from actions import setup_action_routes
from auth import ADMIN_SECRET, admin_auth
from db import engine
from views import ALL_VIEWS

logger = logging.getLogger("admin.audit")

MUTATING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

app = FastAPI(title="Ресурс-Плюс Админ-панель")


@app.middleware("http")
async def audit_log_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    response = await call_next(request)
    if request.method in MUTATING_METHODS:
        login = request.session.get("login") if "session" in request.scope else None
        ts = datetime.now(UTC).isoformat()
        logger.info(
            "admin-audit: ts=%s login=%s method=%s path=%s status=%s",
            ts,
            login,
            request.method,
            request.url.path,
            response.status_code,
        )
    return response


app.add_middleware(
    SessionMiddleware,
    secret_key=ADMIN_SECRET,
    https_only=True,
    same_site="strict",
)
setup_action_routes(app)

admin = Admin(
    app,
    engine,
    authentication_backend=admin_auth,
    title="Ресурс-Плюс | Админка",
    base_url="/admin",
    templates_dir=os.path.join(os.path.dirname(__file__), "templates"),
)

for view in ALL_VIEWS:
    admin.add_view(view)
