"Use case: list available roles."
from fastapi import HTTPException, status

from schemas.login import AvailableRoleItem, AvailableRolesResponse
from services.login.repository import LoginRepository


class ListAvailableRolesUseCase:
    "Возвращает роли, доступные для переключения у текущего юзера (по его email)."

    def __init__(self, repo: LoginRepository) -> None:
        self.repo = repo

    async def execute(self, current_user_id: int) -> AvailableRolesResponse:
        "Запускает основной сценарий use case."
        user = await self.repo.find_user_by_id(current_user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Сессия истекла",
            )
        if not user.email:
            return AvailableRolesResponse(roles=[])

        others = await self.repo.list_other_role_users_by_email(
            user.email, exclude_user_id=user.id
        )
        return AvailableRolesResponse(
            roles=[
                AvailableRoleItem(role=u.role, email_verified=bool(u.email_verified))
                for u in others
            ]
        )
