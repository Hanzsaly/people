import os
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.repository.users import AbstractUserRepository
from app.domain.entities import UserEntity
from app.schemas import UserRegister, UserLogin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 часа


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

    async def login(self, data: UserLogin) -> str:
        user = await self.repo.get_by_phone(data.phone)
        if not user or not pwd_context.verify(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Неверный телефон или пароль")

        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {"sub": str(user.id), "exp": expire}
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return token
