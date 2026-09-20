from abc import ABC, abstractmethod

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import User
from app.domain.entities import UserEntity


def _to_entity(user: User) -> UserEntity:
    return UserEntity(
        id=user.id,
        phone=user.phone,
        password_hash=user.password_hash,
        created_at=user.created_at,
    )


class AbstractUserRepository(ABC):
    @abstractmethod
    async def get_by_phone(self, phone: str) -> UserEntity | None:
        ...

    @abstractmethod
    async def add(self, phone: str, password_hash: str) -> UserEntity:
        ...


class UserRepository(AbstractUserRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_phone(self, phone: str) -> UserEntity | None:
        result = await self.db.execute(select(User).where(User.phone == phone))
        user = result.scalar_one_or_none()
        return _to_entity(user) if user else None

    async def add(self, phone: str, password_hash: str) -> UserEntity:
        user = User(phone=phone, password_hash=password_hash)
        self.db.add(user)
        await self.db.flush()      # получить id, но без коммита
        await self.db.refresh(user)
        return _to_entity(user)