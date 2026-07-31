from fastapi import HTTPException, status

from models.account import Account
from services.labor_resources.repository import LaborRepository


class LaborPolicy:
    def __init__(self, repository: LaborRepository) -> None:
        self.repository = repository

    async def require_user(
        self,
        user_id: int,
        for_update: bool = False,
    ) -> Account:
        user = await self.repository.get_user(user_id, for_update=for_update)
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет доступа",
            )
        return user
