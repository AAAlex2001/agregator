import re

from fastapi import HTTPException, status
from passlib.context import CryptContext
from starlette.concurrency import run_in_threadpool

password_context = CryptContext(
    schemes=["argon2"],
    argon2__time_cost=2,
    argon2__memory_cost=19456,
    argon2__parallelism=1,
)


def ensure_password_strong(password: str) -> None:
    "Бросает HTTPException, если пароль не соответствует требованиям."
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


async def hash_password(password: str) -> str:
    return await run_in_threadpool(password_context.hash, password)


async def verify_password(password: str, password_hash: str) -> bool:
    return await run_in_threadpool(password_context.verify, password, password_hash)
