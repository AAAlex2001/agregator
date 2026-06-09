"Авторизация для внутренних ручек, которые дёргает админ-сервис. Сверяет header X-Internal-Token с ENV-секретом."

import os
import secrets

from fastapi import Header, HTTPException, status

INTERNAL_API_TOKEN = os.getenv("INTERNAL_API_TOKEN", "")


async def require_internal_token(x_internal_token: str = Header(...)) -> None:
    "Принимает запрос только если в header X-Internal-Token совпадает с серверным ENV-токеном."
    if not INTERNAL_API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="INTERNAL_API_TOKEN не настроен на сервере",
        )
    if not secrets.compare_digest(x_internal_token, INTERNAL_API_TOKEN):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный internal token",
        )
