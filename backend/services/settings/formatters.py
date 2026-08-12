"Форматирование сущностей в API-структуры."
from models.account import Account
from schemas.settings import (
    EmailPreferences,
    ExpertProfileData,
    LicenseHolderProfileData,
    UserSettingsResponse,
)


def preference_value(account: Account, field: str) -> bool:
    "Читает тумблер уведомления из аккаунта или профиля роли; если поля у роли нет — считается включённым."
    sources = (
        account,
        account.customer_profile,
        account.expert_profile,
        account.license_holder_profile,
    )
    for source in sources:
        if source is not None and hasattr(source, field):
            return bool(getattr(source, field))
    return True


def build_email_preferences(account: Account) -> EmailPreferences:
    "Собирает все флаги email-уведомлений из аккаунта и профилей ролей."
    return EmailPreferences(
        **{field: preference_value(account, field) for field in EmailPreferences.model_fields}
    )


def build_directions(account: Account) -> list[str]:
    "Сводные направления заказчика или держателя: отметки плюс направления с заполненными анкетами."
    profile = account.customer_profile or account.license_holder_profile
    marks = getattr(profile, "directions", None)
    result = list(marks) if isinstance(marks, list) else []
    for key, direction_profile in (
        ("AUDIT_SUPB", getattr(profile, "audit_profile", None)),
        ("TECH_DIAG", getattr(profile, "tech_diag_profile", None)),
        ("DESIGN", getattr(profile, "design_profile", None)),
    ):
        if direction_profile is not None and key not in result:
            result.append(key)
    return result


def to_response(account: Account) -> UserSettingsResponse:
    "Собирает ответ настроек личного кабинета из аккаунта и профиля его роли."
    expert = account.expert_profile
    holder = account.license_holder_profile
    return UserSettingsResponse(
        id=account.id,
        role=account.role.value,
        email=account.email,
        email_verified=bool(account.email_verified),
        phone=account.phone,
        avatar_url=account.avatar_url,
        first_name=account.first_name,
        last_name=account.last_name,
        inn=account.inn,
        company_data=account.company_data if isinstance(account.company_data, dict) else None,
        email_preferences=build_email_preferences(account),
        notify_order_types=(
            expert.notify_order_types
            if expert is not None and isinstance(expert.notify_order_types, list)
            else []
        ),
        directions=build_directions(account),
        notifications_introduced=bool(account.notifications_introduced),
        expert=ExpertProfileData.model_validate(expert) if expert is not None else None,
        license_holder=(
            LicenseHolderProfileData.model_validate(holder) if holder is not None else None
        ),
    )
