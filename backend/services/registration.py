import re

from fastapi import BackgroundTasks, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.user import User, UserRole as ModelUserRole
from schemas.registration import (
    LicenseHolderRegistration,
    LicenseRentalKind,
    UserRegistration,
    UserRole,
)
from services.verification import VerificationService
from utils.passwords import hash_password

EMAIL_CONFIRMATION_SUBJECT = "Подтверждение почты на Ресурс-Плюс"


class RegistrationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.verification = VerificationService(db)

    def validate_password(self, password: str) -> None:
        errors = []
        if len(password) < 6:
            errors.append("Не менее 6 символов")
        if not re.search(r'[A-Z]', password):
            errors.append("Хотя бы одна заглавная буква")
        if not re.search(r'[a-z]', password):
            errors.append("Хотя бы одна строчная буква")
        if not re.match(r'^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?`~ ]+$', password):
            errors.append("Только латинские буквы, цифры и спецсимволы")
        if errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароль не соответствует требованиям: " + "; ".join(errors),
            )

    def validate_inn_format(self, inn: str | None) -> None:
        if not inn:
            return
        if not inn.isdigit() or len(inn) not in {10, 12}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ИНН должен содержать 10 или 12 цифр",
            )

    async def user_field_taken(self, column, value, role: UserRole) -> bool:
        query = select(User.id).where(column == value, User.role == ModelUserRole(role.value))
        result = await self.db.execute(query)
        return result.first() is not None

    async def ensure_email_is_free(self, email: str, role: UserRole) -> None:
        if await self.user_field_taken(User.email, email, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот email уже используется для роли",
            )

    async def ensure_phone_is_free(self, phone: str | None, role: UserRole) -> None:
        if not phone:
            return
        if await self.user_field_taken(User.phone, phone, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот номер уже используется для роли",
            )

    async def ensure_inn_is_free(self, inn: str | None, role: UserRole) -> None:
        if not inn:
            return
        if await self.user_field_taken(User.inn, inn, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот ИНН уже используется для роли",
            )

    def ensure_customer_has_company(self, data: UserRegistration) -> None:
        if data.role != UserRole.CUSTOMER:
            return
        if not data.inn or not data.company_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Заказчик должен указать ИНН и компанию",
            )

    def ensure_company_matches_inn(self, inn: str | None, company_data: dict | None) -> None:
        if not inn or not isinstance(company_data, dict):
            return
        company_inn = (company_data.get("data") or {}).get("inn")
        if company_inn and company_inn != inn:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Выбранная компания не соответствует указанному ИНН",
            )

    async def create_user(self, data: UserRegistration) -> User:
        self.validate_password(data.password)
        self.ensure_customer_has_company(data)
        self.validate_inn_format(data.inn)
        self.ensure_company_matches_inn(data.inn, data.company_data)

        await self.ensure_email_is_free(data.email, data.role)
        await self.ensure_phone_is_free(data.phone, data.role)
        await self.ensure_inn_is_free(data.inn, data.role)

        new_user = User(
            role=data.role,
            phone=data.phone,
            email=data.email,
            email_verified=False,
            inn=data.inn,
            company_data=data.company_data,
            password=await hash_password(data.password),
            first_name=data.first_name,
            last_name=data.last_name,
        )
        self.db.add(new_user)
        await self.db.flush()
        return new_user

    async def create_license_holder(
        self,
        data: LicenseHolderRegistration,
        license_file_url: str | None,
    ) -> User:
        "Создаёт держателя лицензии. Pydantic уже всё провалидировал — здесь только уникальность и запись."
        self.validate_password(data.password)
        await self.ensure_email_is_free(data.email, UserRole.LICENSE_HOLDER)
        await self.ensure_phone_is_free(data.phone, UserRole.LICENSE_HOLDER)
        await self.ensure_inn_is_free(data.inn, UserRole.LICENSE_HOLDER)

        new_user = User(
            role=ModelUserRole.LICENSE_HOLDER,
            email=data.email,
            email_verified=False,
            phone=data.phone,
            inn=data.inn,
            company_data=data.company_data,
            password=await hash_password(data.password),
            license_number=data.license_number,
            license_file_url=license_file_url,
            license_areas=data.license_areas,
            license_rental_kind=data.license_rental_kind.value,
            license_rental_percent=(
                data.license_rental_percent
                if data.license_rental_kind is LicenseRentalKind.PERCENT
                else None
            ),
            license_rental_fixed_amount=(
                data.license_rental_fixed_amount
                if data.license_rental_kind is LicenseRentalKind.FIXED
                else None
            ),
            # Лицензиат пока не подписан ни на какие email-уведомления.
            email_on_response_created=False,
            email_on_response_updated=False,
            email_on_expert_rejected=False,
            email_on_new_order=False,
            email_on_order_updated=False,
            email_on_bidding_finished=False,
            email_on_chat_message=False,
            email_on_question_asked=False,
            email_on_question_answered=False,
        )
        self.db.add(new_user)
        await self.db.flush()
        return new_user

    async def send_email_confirmation(self, user: User) -> None:
        if not user.email:
            return
        await self.verification.send_code_to_email(
            user.id,
            user.email,
            EMAIL_CONFIRMATION_SUBJECT,
        )

    async def schedule_email_confirmation(self, user: User, background_tasks: BackgroundTasks) -> None:
        "Выдаёт код в БД и отправляет письмо в фоне — регистрация отвечает клиенту сразу."
        if not user.email:
            return
        await self.verification.schedule_code_email(
            user.id,
            user.email,
            EMAIL_CONFIRMATION_SUBJECT,
            background_tasks,
        )

    async def find_user_by_email(self, email: str, role: UserRole | None = None) -> User | None:
        query = select(User).where(User.email == email)
        if role is not None:
            query = query.where(User.role == ModelUserRole(role.value))
        result = await self.db.execute(query)
        candidates = list(result.scalars().all())
        if not candidates:
            return None
        # При нескольких ролях на одну почту — берём ту, что ещё не подтверждена
        unverified = [u for u in candidates if not u.email_verified]
        return unverified[0] if unverified else candidates[0]

    async def confirm_email(self, email: str, code: str, role: UserRole | None = None) -> User:
        user = await self.find_user_by_email(email, role)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return await self.verification.confirm_email(user, code)

    async def resend_confirmation(
        self,
        email: str,
        background_tasks: BackgroundTasks,
        role: UserRole | None = None,
    ) -> None:
        user = await self.find_user_by_email(email, role)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        if user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Почта уже подтверждена",
            )
        await self.schedule_email_confirmation(user, background_tasks)
