from passlib.context import CryptContext
from starlette.concurrency import run_in_threadpool


password_context = CryptContext(
    schemes=["argon2"],
    argon2__time_cost=2,
    argon2__memory_cost=19456,
    argon2__parallelism=1,
)


async def hash_password(password: str) -> str:
    return await run_in_threadpool(password_context.hash, password)


async def verify_password(password: str, password_hash: str) -> bool:
    return await run_in_threadpool(password_context.verify, password, password_hash)
