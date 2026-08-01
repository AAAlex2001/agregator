"Форматирование сущностей в API-структуры."
from models.account import Account
from schemas.settings import EmailPreferences, UserSettingsResponse


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


def to_response(account: Account) -> UserSettingsResponse:
    "Собирает ответ настроек личного кабинета из аккаунта и профилей ролей."
    expert = account.expert_profile
    holder = account.license_holder_profile
    customer = account.customer_profile
    return UserSettingsResponse(
        id=account.id,
        position=customer.position if customer is not None else "",
        opo_license_number=customer.opo_license_number if customer is not None else None,
        inn=account.inn,
        company_data=account.company_data if isinstance(account.company_data, dict) else None,
        email=account.email,
        email_verified=bool(account.email_verified),
        phone=account.phone,
        avatar_url=account.avatar_url,
        first_name=account.first_name,
        last_name=account.last_name,
        rating=float(expert.rating) if expert is not None and expert.rating is not None else None,
        review_count=(expert.review_count or 0) if expert is not None else 0,
        role=account.role.value,
        email_preferences=build_email_preferences(account),
        notify_order_types=(
            expert.notify_order_types
            if expert is not None and isinstance(expert.notify_order_types, list)
            else []
        ),
        notifications_introduced=bool(account.notifications_introduced),
        license_number=holder.license_number if holder is not None else None,
        license_file_url=holder.license_file_url if holder is not None else None,
        license_areas=(
            holder.license_areas
            if holder is not None and isinstance(holder.license_areas, list)
            else None
        ),
        license_rental_kind=holder.license_rental_kind if holder is not None else None,
        license_rental_percent=(
            float(holder.license_rental_percent)
            if holder is not None and holder.license_rental_percent is not None
            else None
        ),
        license_rental_fixed_amount=holder.license_rental_fixed_amount if holder is not None else None,
        mining_license_number=holder.mining_license_number if holder is not None else None,
        mining_license_file_url=holder.mining_license_file_url if holder is not None else None,
        sro_design_file_url=holder.sro_design_file_url if holder is not None else None,
        lab_accreditation_number=holder.lab_accreditation_number if holder is not None else None,
        lab_accreditation_file_url=holder.lab_accreditation_file_url if holder is not None else None,
        company_card_url=holder.company_card_url if holder is not None else None,
        location_lat=expert.location_lat if expert is not None else None,
        location_lng=expert.location_lng if expert is not None else None,
        location_address=expert.location_address if expert is not None else None,
        location_city=expert.location_city if expert is not None else None,
        travels_to_other_regions=bool(expert.travels_to_other_regions) if expert is not None else False,
        expert_certificates=(
            expert.certificates
            if expert is not None and isinstance(expert.certificates, list)
            else None
        ),
        expert_show_on_map=bool(expert.show_on_map) if expert is not None else True,
        expert_map_fields=(
            expert.map_fields
            if expert is not None and isinstance(expert.map_fields, list)
            else None
        ),
    )
