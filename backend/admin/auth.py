"Cookie-based аутентификация для админки. Логин/пароль из ENV."

import secrets

from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse

from admin.config import admin_config


class AdminAuth(AuthenticationBackend):
    "Простая сессионная аутентификация: проверяем username+password из ENV и кладём токен в session cookie."

    async def login(self, request: Request) -> bool:
        "Принимает форму /admin/login. Возвращает True если креды совпали с ENV."
        form = await request.form()
        username = str(form.get("username", ""))
        password = str(form.get("password", ""))

        ok_user = secrets.compare_digest(username, admin_config.admin_username)
        ok_pass = secrets.compare_digest(password, admin_config.admin_password)
        if not (ok_user and ok_pass):
            return False

        request.session.update({"admin_token": secrets.token_hex(16)})
        return True

    async def logout(self, request: Request) -> bool:
        "Сброс admin-сессии."
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool | RedirectResponse:
        "Гард перед каждым админ-запросом: пустит дальше только при наличии токена в сессии."
        token = request.session.get("admin_token")
        if not token:
            return RedirectResponse(request.url_for("admin:login"), status_code=302)
        return True


admin_auth = AdminAuth(secret_key=admin_config.admin_session_secret)
