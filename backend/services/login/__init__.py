from services.login.cookies import set_role_cookie, set_session_cookie, set_session_cookies
from services.login.repository import (
    SESSION_COOKIE_MAX_AGE_SECONDS,
    SESSION_MAX_DAYS,
    SESSION_TTL_DAYS,
    LoginRepository,
)
from services.login.use_cases.authenticate_user import AuthenticateUserUseCase
from services.login.use_cases.create_session import CreateSessionUseCase
from services.login.use_cases.list_available_roles import ListAvailableRolesUseCase
from services.login.use_cases.logout_session import LogoutSessionUseCase
from services.login.use_cases.refresh_session import RefreshSessionUseCase
from services.login.use_cases.switch_role import SwitchRoleUseCase
from services.login.validators import LoginValidator

__all__ = [
    "AuthenticateUserUseCase",
    "CreateSessionUseCase",
    "ListAvailableRolesUseCase",
    "LoginRepository",
    "LoginValidator",
    "LogoutSessionUseCase",
    "RefreshSessionUseCase",
    "SESSION_COOKIE_MAX_AGE_SECONDS",
    "SESSION_MAX_DAYS",
    "SESSION_TTL_DAYS",
    "SwitchRoleUseCase",
    "set_role_cookie",
    "set_session_cookie",
    "set_session_cookies",
]
