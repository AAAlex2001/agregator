"Бизнес-валидации для login."
from fastapi import HTTPException, status

from utils.passwords import verify_password


class LoginValidator:
    "Валидация входных данных логина и проверка пароля."

    @staticmethod
    def ensure_contact_provided(email: str | None, phone: str | None, inn: str | None) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if email or phone or inn:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Необходимо указать email, телефон или ИНН",
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
    async def verify_password(plain: str, hashed: str) -> bool:
        "Публичный метод сервисного слоя."
        return await verify_password(plain, hashed)
