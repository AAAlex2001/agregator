"Регистрация SQLAdmin на FastAPI: монтирует /admin и подключает все views + дашборд."

from fastapi import FastAPI
from sqladmin import Admin

# Прогружаем все модели чтобы SQLAlchemy зарегистрировала relationships для back_populates.
# Иначе при первой инициализации mapper'а вылетает InvalidRequestError на forward refs.
import models.article  # noqa: F401
import models.chat  # noqa: F401
import models.email_change  # noqa: F401
import models.landing  # noqa: F401
import models.notification  # noqa: F401
import models.order  # noqa: F401
import models.password_reset_code  # noqa: F401
import models.payment  # noqa: F401
import models.platform_settings  # noqa: F401
import models.pricing  # noqa: F401
import models.question  # noqa: F401
import models.response  # noqa: F401
import models.review  # noqa: F401
import models.session  # noqa: F401
import models.support_ticket  # noqa: F401
import models.user  # noqa: F401
from admin.auth import admin_auth
from admin.dashboard import DashboardView
from admin.views import ALL_VIEWS
from database.database import engine


def setup_admin(app: FastAPI) -> Admin:
    "Маунтит SQLAdmin на /admin и регистрирует все ModelView + кастомный дашборд."
    admin = Admin(
        app=app,
        engine=engine,
        authentication_backend=admin_auth,
        title="Ресурс-Плюс — Админка",
        base_url="/admin",
    )
    admin.add_view(DashboardView)
    for view in ALL_VIEWS:
        admin.add_view(view)
    return admin
