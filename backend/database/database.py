"""
Настройка подключения к базе данных
"""
import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# URL подключения к базе данных из переменных окружения
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL must be set in .env file")

# Создание движка базы данных
# Логирование SQL запросов (только в режиме разработки)
ECHO_SQL = os.getenv("ECHO_SQL", "False").lower() == "true"

engine = create_async_engine(
    DATABASE_URL,
    echo=ECHO_SQL,
    future=True,
    pool_size=60,
    max_overflow=30,
    pool_timeout=15,
    pool_recycle=300,
    pool_pre_ping=True,
)

# Создание фабрики сессий
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency для получения сессии базы данных
    Используется в FastAPI через Depends(get_db)
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

