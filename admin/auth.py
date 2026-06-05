"Авторизация в админке: сверка логина/пароля по ENV и контроль длины пароля и секрета сессии."

import os

from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

ADMIN_LOGIN = os.environ["ADMIN_LOGIN"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
ADMIN_SECRET = os.environ["ADMIN_SECRET"]

if len(ADMIN_PASSWORD) < 12:
    raise RuntimeError("ADMIN_PASSWORD должен быть не короче 12 символов")
if len(ADMIN_SECRET) < 32:
    raise RuntimeError("ADMIN_SECRET должен быть не короче 32 символов (используется для подписи cookie)")


class AdminAuth(AuthenticationBackend):
    "Бэкенд аутентификации SQLAdmin: проверка логина/пароля из ENV и хранение факта входа в сессии."

    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")
        if username == ADMIN_LOGIN and password == ADMIN_PASSWORD:
            request.session.update({"authenticated": True})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("authenticated", False)


admin_auth = AdminAuth(secret_key=ADMIN_SECRET)
