import re
from pydantic import BaseModel, field_validator


class UserRegister(BaseModel):
    phone: str
    password: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not re.match(r"^\+7\d{10}$", v):
            raise ValueError("Телефон должен быть в формате +7XXXXXXXXXX")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Пароль должен быть не короче 8 символов")
        return v


class UserOut(BaseModel):
    id: int
    phone: str

    class Config:
        from_attributes = True