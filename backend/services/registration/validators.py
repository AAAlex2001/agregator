"Бизнес-валидации для registration."
from typing import Any

from fastapi import HTTPException, status

from models.account import Account, UserRole
from schemas.registration import UserRegistration
from services.registration.disposable_email_domains import ensure_email_not_disposable
from services.registration.repository import RegistrationRepository
from utils.inn import is_valid_inn
from utils.passwords import ensure_password_strong


def ensure_inn_format(inn: str | None) -> None:
    "Бросает HTTPException, если заполненный ИНН не из 10 или 12 цифр."
    if not inn:
        return
    if not is_valid_inn(inn):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ИНН должен содержать 10 или 12 цифр",
        )


class RegistrationValidator:
    "Валидация входных данных регистрации и проверка уникальности через репозиторий."

    def __init__(self, repo: RegistrationRepository) -> None:
        self.repo = repo

    ensure_email_not_disposable = staticmethod(ensure_email_not_disposable)
    ensure_password_strong = staticmethod(ensure_password_strong)
    ensure_inn_format = staticmethod(ensure_inn_format)

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
        if await self.repo.is_field_taken(Account.email, email, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот email уже используется для роли",
            )

    async def ensure_phone_is_free(self, phone: str | None, role: UserRole) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if not phone:
            return
        if await self.repo.is_field_taken(Account.phone, phone, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот номер уже используется для роли",
            )

    async def ensure_inn_is_free(self, inn: str | None, role: UserRole) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if not inn:
            return
        if await self.repo.is_field_taken(Account.inn, inn, role):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот ИНН уже используется для роли",
            )
