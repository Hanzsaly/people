from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.repository.users import AbstractUserRepository
from app.domain.entities import UserEntity
from app.schemas import UserRegister

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: AsyncSession, repo: AbstractUserRepository):
        self.db = db
        self.repo = repo

    async def register(self, data: UserRegister) -> UserEntity:
        existing = await self.repo.get_by_phone(data.phone)
        if existing:
            raise HTTPException(status_code=409, detail="Этот телефон уже зарегистрирован")

        password_hash = pwd_context.hash(data.password)
        user = await self.repo.add(data.phone, password_hash)
        await self.db.commit()
        return user