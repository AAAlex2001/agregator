"Бизнес-валидации для registration."
import re
from typing import Any

from fastapi import HTTPException, status

from models.user import User
from schemas.registration import UserRegistration, UserRole
from services.registration.disposable_email_domains import ensure_email_not_disposable
from services.registration.repository import RegistrationRepository


class RegistrationValidator:
    "Валидация входных данных регистрации и проверка уникальности через репозиторий."

    def __init__(self, repo: RegistrationRepository) -> None:
        self.repo = repo

    ensure_email_not_disposable = staticmethod(ensure_email_not_disposable)

    @staticmethod
    def ensure_password_strong(password: str) -> None:
        "Бросает HTTPException, если условие не выполнено."
        errors = []
        if len(password) < 6:
            errors.append("Не менее 6 символов")
        if not re.search(r"[A-Z]", password):
            errors.append("Хотя бы одна заглавная буква")
        if not re.search(r"[a-z]", password):
            errors.append("Хотя бы одна строчная буква")
        if not re.match(r'^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?`~ ]+$', password):
            errors.append("Только латинские буквы, цифры и спецсимволы")
        if errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароль не соответствует требованиям: " + "; ".join(errors),
            )

    @staticmethod
    def ensure_inn_format(inn: str | None) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if not inn:
            return
        if not inn.isdigit() or len(inn) not in {10, 12}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ИНН должен содержать 10 или 12 цифр",
            )

    @staticmethod
    def ensure_customer_has_company(data: UserRegistration) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if data.role != UserRole.CUSTOMER:
            return
        if not data.inn or not data.company_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Заказчик должен указать ИНН и компанию",
            )

    @staticmethod
    def ensure_company_matches_inn(inn: str | None, company_data: dict[str, Any] | None) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if not inn or not isinstance(company_data, dict):
            return
        company_inn = (company_data.get("data") or {}).get("inn")
        if company_inn and company_inn != inn:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Выбранная компания не соответствует указанному ИНН",
            )

    async def ensure_email_is_free(self, email: str, role: UserRole) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if await self.repo.is_field_taken(User.email, email, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот email уже используется для роли",
            )

    async def ensure_phone_is_free(self, phone: str | None, role: UserRole) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if not phone:
            return
        if await self.repo.is_field_taken(User.phone, phone, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот номер уже используется для роли",
            )

    async def ensure_inn_is_free(self, inn: str | None, role: UserRole) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if not inn:
            return
        if await self.repo.is_field_taken(User.inn, inn, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот ИНН уже используется для роли",
            )
