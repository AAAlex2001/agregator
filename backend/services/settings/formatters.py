from models.user import User
from schemas.settings import EmailPreferences, UserSettingsResponse


def to_response(user: User) -> UserSettingsResponse:
    license_areas = user.license_areas if isinstance(user.license_areas, list) else None
    return UserSettingsResponse(
        id=user.id,
        inn=user.inn,
        company_data=user.company_data if isinstance(user.company_data, dict) else None,
        email=user.email,
        email_verified=bool(user.email_verified),
        phone=user.phone,
        avatar_url=user.avatar_url,
        first_name=user.first_name,
        last_name=user.last_name,
        rating=float(user.rating) if user.rating is not None else None,
        review_count=user.review_count or 0,
        role=user.role.value,
        email_preferences=EmailPreferences.model_validate(user),
        license_number=user.license_number,
        license_file_url=user.license_file_url,
        license_areas=license_areas,
        license_rental_kind=user.license_rental_kind,
        license_rental_percent=(
            float(user.license_rental_percent) if user.license_rental_percent is not None else None
        ),
        license_rental_fixed_amount=user.license_rental_fixed_amount,
        company_card_url=user.company_card_url,
    )
