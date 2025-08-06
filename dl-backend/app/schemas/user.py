from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class UserRead(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True 