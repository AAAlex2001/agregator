from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from models.license_holder import LicenseRentalKind
from schemas.registration import validate_password_complexity
from services.directions.registry import validate_direction_keys
from services.order_notification_types import ALL_ORDER_NOTIFICATION_TYPES_SET


class EmailPreferences(BaseModel):
    "Гранулярные флаги уведомлений на email. Дефолтно всё включено."
    email_on_response_created: bool = True
    email_on_response_updated: bool = True
    email_on_expert_rejected: bool = True
    email_on_order_updated: bool = True
    email_on_bidding_finished: bool = True
    email_on_chat_message: bool = True
    email_on_question_asked: bool = True
    email_on_question_answered: bool = True
    email_on_new_blog_post: bool = True
    email_on_labor_listing: bool = True
    notify_telegram_enabled: bool = True

    model_config = ConfigDict(from_attributes=True)


class UpdatePersonalDataRequest(BaseModel):
    """Обновление персональных данных пользователя (без email — он меняется отдельным эндпоинтом с подтверждением кода)."""
    last_name: str | None = Field(None, description="Фамилия", max_length=100)
    first_name: str | None = Field(None, description="Имя", max_length=100)
    phone: str | None = Field(None, description="Номер телефона", max_length=20)
    inn: str | None = Field(None, description="ИНН", min_length=10, max_length=12)

    @model_validator(mode="after")
    def validate_phone_format(self) -> "UpdatePersonalDataRequest":
        """Проверка формата телефона и ИНН."""
        if self.phone:
            phone_digits = "".join(symbol for symbol in self.phone if symbol.isdigit())
            if len(phone_digits) < 10:
                raise ValueError("Номер телефона должен содержать минимум 10 цифр")

        if self.inn and (not self.inn.isdigit() or len(self.inn) not in {10, 12}):
            raise ValueError("ИНН должен содержать 10 или 12 цифр")
        return self


class RequestEmailChangeRequest(BaseModel):
    "Шаг 1 смены email — юзер вводит новый адрес. Бэкенд шлёт код на этот адрес."
    new_email: EmailStr


class ConfirmEmailChangeRequest(BaseModel):
    "Шаг 2 смены email — юзер вводит код, пришедший на новый адрес."
    code: str = Field(..., min_length=4, max_length=10)


class UpdateEmailPreferencesRequest(BaseModel):
    "Частичный патч флагов уведомлений. Любое поле опционально."
    email_on_response_created: bool | None = None
    email_on_response_updated: bool | None = None
    email_on_expert_rejected: bool | None = None
    email_on_order_updated: bool | None = None
    email_on_bidding_finished: bool | None = None
    email_on_chat_message: bool | None = None
    email_on_question_asked: bool | None = None
    email_on_question_answered: bool | None = None
    email_on_new_blog_post: bool | None = None
    email_on_labor_listing: bool | None = None
    notify_telegram_enabled: bool | None = None


class UpdateOrderNotificationsRequest(BaseModel):
    "Коды направлений экспертизы и видов инженерных работ, по которым эксперт хочет уведомления. Пустой список — рассылка выключена."
    order_types: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_types(self) -> "UpdateOrderNotificationsRequest":
        unknown = [
            notification_type
            for notification_type in self.order_types
            if notification_type not in ALL_ORDER_NOTIFICATION_TYPES_SET
        ]
        if unknown:
            raise ValueError(f"Недопустимые коды: {', '.join(unknown)}")
        self.order_types = list(dict.fromkeys(self.order_types))
        return self


class UpdateExpertLocationRequest(BaseModel):
    """Присутствие исполнителя на карте: где базируется, выезжает ли и что показывать в метке.

    Настройка общая для всех направлений — не зависит от того, какие анкеты заполнены.
    """
    location_lat: float | None = Field(None, ge=-90, le=90)
    location_lng: float | None = Field(None, ge=-180, le=180)
    location_address: str | None = Field(None, max_length=500)
    location_city: str | None = Field(None, max_length=200)
    travels_to_other_regions: bool = False
    show_on_map: bool = True
    map_fields: list[str] = Field(default_factory=list, max_length=10)


class ChangePasswordRequest(BaseModel):
    """Смена пароля пользователя"""
    new_password: str = Field(..., description="Новый пароль", min_length=6)
    new_password_confirm: str = Field(..., description="Подтверждение нового пароля")

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        return validate_password_complexity(value)

    @model_validator(mode="after")
    def check_passwords_match(self) -> "ChangePasswordRequest":
        if self.new_password != self.new_password_confirm:
            raise ValueError("Пароли не совпадают")
        return self


class UpdateLicenseHolderRequest(BaseModel):
    "Редактирование лицензии в личном кабинете. Файл лицензии меняется отдельным upload-ом."
    license_number: str = Field(..., min_length=1, max_length=100)
    license_areas: list[str] = Field(..., min_length=1)
    license_rental_kind: LicenseRentalKind
    license_rental_percent: float | None = Field(None, gt=0, le=100)
    license_rental_fixed_amount: int | None = Field(None, gt=0)
    mining_license_number: str | None = Field(None, max_length=100)
    lab_accreditation_number: str | None = Field(None, max_length=100)

    @model_validator(mode="after")
    def cross_field_checks(self) -> "UpdateLicenseHolderRequest":
        if self.license_rental_kind is LicenseRentalKind.PERCENT and self.license_rental_percent is None:
            raise ValueError("Укажите процент от суммы договора")
        if self.license_rental_kind is LicenseRentalKind.FIXED and self.license_rental_fixed_amount is None:
            raise ValueError("Укажите минимальную фиксированную цену предоставления лицензии")
        return self


class ExpertProfileData(BaseModel):
    "Профиль роли «исполнитель»: репутация и место базирования. Анкеты направлений — в /directions."
    rating: float | None = None
    review_count: int = 0
    location_lat: float | None = None
    location_lng: float | None = None
    location_address: str | None = None
    location_city: str | None = None
    travels_to_other_regions: bool = False
    show_on_map: bool = True
    map_fields: list[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("map_fields", mode="before")
    @classmethod
    def default_map_fields(cls, value: list[str] | None) -> list[str]:
        "Колонка map_fields nullable: NULL из БД отдаётся пустым списком, а не ломает ответ."
        return value if value is not None else []


class LicenseHolderProfileData(BaseModel):
    "Профиль роли «держатель разрешительных документов»: лицензия и условия её предоставления."
    license_number: str | None = None
    license_file_url: str | None = None
    license_areas: list[str] | None = None
    license_rental_kind: LicenseRentalKind | None = None
    license_rental_percent: float | None = None
    license_rental_fixed_amount: int | None = None
    mining_license_number: str | None = None
    mining_license_file_url: str | None = None
    sro_design_file_url: str | None = None
    lab_accreditation_number: str | None = None
    lab_accreditation_file_url: str | None = None
    company_card_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


class UpdateDirectionsRequest(BaseModel):
    "Отметки направлений заказчика или держателя разрешительных документов."
    directions: list[str] = Field(default_factory=list, max_length=10)

    @field_validator("directions")
    @classmethod
    def validate_directions(cls, value: list[str]) -> list[str]:
        return validate_direction_keys(value)


class UserSettingsResponse(BaseModel):
    """Личный кабинет: общие данные аккаунта, настройки уведомлений и профиль его роли.

    Заполнен ровно один из expert / license_holder — по роли аккаунта; у заказчика оба пустые.
    Анкеты направлений сюда не попадают, их отдаёт /directions/{key}/profile.
    """
    id: int
    role: str
    email: EmailStr | None = None
    email_verified: bool = False
    phone: str | None = None
    avatar_url: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    inn: str | None = None
    company_data: dict[str, Any] | None = None
    email_preferences: EmailPreferences
    notify_order_types: list[str] = Field(default_factory=list)
    directions: list[str] = Field(default_factory=list)
    notifications_introduced: bool = False
    expert: ExpertProfileData | None = None
    license_holder: LicenseHolderProfileData | None = None
