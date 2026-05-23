from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str
    name: str


class Token(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token data"""
    email: str | None = None


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True
