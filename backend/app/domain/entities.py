from dataclasses import dataclass
from datetime import datetime


@dataclass
class UserEntity:
    id: int
    phone: str
    password_hash: str
    created_at: datetime