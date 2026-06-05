"Админ-вьюшка глобальных настроек платформы (фиче-флаги вроде платных откликов)."

from sqladmin import ModelView

from models import PlatformSettings


class PlatformSettingsAdmin(ModelView, model=PlatformSettings):
    "Глобальные настройки платформы: фиче-флаги, переключаемые через одну запись в БД."

    name = "Настройки платформы"
    name_plural = "Настройки платформы"
    icon = "fa-solid fa-toggle-on"
    category = "Настройки"

    can_create = False
    can_delete = False

    column_list = [PlatformSettings.id, PlatformSettings.paid_responses_enabled]
    form_columns = [PlatformSettings.paid_responses_enabled]
    column_labels = {
        PlatformSettings.id: "ID",
        PlatformSettings.paid_responses_enabled: (
            "Платный режим откликов (выкл = эксперты откликаются бесплатно)"
        ),
    }
