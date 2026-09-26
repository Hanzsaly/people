from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas import UserRegister, UserOut, UserLogin, Token
from app.service.auth import AuthService
from app.repository.users import UserRepository
from app.domain.entities import UserEntity
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    service = AuthService(db, repo)
    user = await service.register(data)
    return UserOut(id=user.id, phone=user.phone)


@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    service = AuthService(db, repo)
    token = await service.login(data)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
async def get_me(current_user: UserEntity = Depends(get_current_user)):
    return UserOut(id=current_user.id, phone=current_user.phone)