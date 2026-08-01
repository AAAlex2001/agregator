"Бизнес-валидации для направлений."
from fastapi import HTTPException, status

from models.account import Account
from models.base import Base
from services.directions.registry import Direction, RoleForm, get_direction
from services.directions.repository import DirectionsRepository


class DirectionsValidator:
    "Проверяет существование направления, доступность его роли и наличие профиля роли."

    def __init__(self, repo: DirectionsRepository) -> None:
        self.repo = repo

    async def require_account(self, account_id: int) -> Account:
        "Возвращает аккаунт или бросает 404."
        account = await self.repo.find_account(account_id)
        if account is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return account

    def require_direction(self, key: str) -> Direction:
        "Возвращает направление или бросает 404."
        direction = get_direction(key)
        if direction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Направление не найдено",
            )
        return direction

    def require_form(self, account: Account, direction: Direction) -> RoleForm:
        "Возвращает анкету направления для роли аккаунта или бросает 403."
        form = direction.form_for(account.role)
        if form is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Направление недоступно для вашей роли",
            )
        return form

    def require_role_profile(self, account: Account) -> Base:
        "Возвращает профиль роли аккаунта или бросает 409."
        profile = self.role_profile(account)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Профиль роли не найден",
            )
        return profile

    @staticmethod
    def role_profile(account: Account) -> Base | None:
        "Профиль роли аккаунта: заказчик, исполнитель или держатель документов."
        return (
            account.customer_profile
            or account.expert_profile
            or account.license_holder_profile
        )

    def is_form_filled(self, account: Account, direction: Direction) -> bool:
        "Заполнена ли анкета направления. Поля внутри профиля роли считаются заполненными всегда."
        form = direction.form_for(account.role)
        profile = self.role_profile(account)
        if form is None or profile is None:
            return False
        if not form.is_separate_table:
            return True
        return getattr(profile, form.owner_attribute) is not None
