from pydantic import BaseModel, EmailStr
from typing import Optional
from ..models.user import UserRole

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True