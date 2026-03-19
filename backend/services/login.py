from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User, UserRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    async def get_user_by_email_and_role(self, email: str, role: UserRole) -> User | None:
        query = select(User).where(User.email == email, User.role == role)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_user_by_phone_and_role(self, phone: str, role: UserRole) -> User | None:
        query = select(User).where(User.phone == phone, User.role == role)
        result = await self.db.execute(query)
        return result.scalars().first()
