"Корень FastAPI-приложения админки: монтирует action-роуты, регистрирует все ModelView/BaseView."

import os

from fastapi import FastAPI
from sqladmin import Admin
from starlette.middleware.sessions import SessionMiddleware

from actions import setup_action_routes
from auth import ADMIN_SECRET, admin_auth
from db import engine
from views import ALL_VIEWS

app = FastAPI(title="Ресурс-Плюс Админ-панель")
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
