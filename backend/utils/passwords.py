import os

from passlib.context import CryptContext
from starlette.concurrency import run_in_threadpool


BCRYPT_ROUNDS = int(os.getenv("BCRYPT_ROUNDS", "12"))
password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=BCRYPT_ROUNDS,
)


async def hash_password(password: str) -> str:
    return await run_in_threadpool(password_context.hash, password)


async def verify_password(password: str, password_hash: str) -> bool:
    return await run_in_threadpool(password_context.verify, password, password_hash)
