from fastapi import APIRouter, Depends, status, Form
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.auth import get_current_user
from ..services.auth import AuthService
from ..schemas.auth import UserLogin, UserRegister, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    email: str = Form(..., description="Valid email address"),
    password: str = Form(..., description="User password (will be hashed)"),
    name: str = Form(..., description="User's full name"),
    db: Session = Depends(get_db)
):
    """
    Register a new user

    - **email**: Valid email address
    - **password**: User password (will be hashed)
    - **name**: User's full name
    """
    user_data = UserRegister(email=email, password=password, name=name)
    auth_service = AuthService(db)
    user = auth_service.register(user_data)
    return user


@router.post("/login", response_model=Token)
def login(
    email: str = Form(..., description="User's email"),
    password: str = Form(..., description="User's password"),
    db: Session = Depends(get_db)
):
    """
    Login and get access token

    - **email**: User's email
    - **password**: User's password

    Returns JWT access token to use in Authorization header:
    ```
    Authorization: Bearer <token>
    ```
    """
    credentials = UserLogin(email=email, password=password)
    auth_service = AuthService(db)
    return auth_service.login(credentials)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get current authenticated user information

    Requires authentication token in header:
    ```
    Authorization: Bearer <token>
    ```
    """
    auth_service = AuthService(db)
    user = auth_service.get_current_user_info(current_user["user_id"])
    return user
