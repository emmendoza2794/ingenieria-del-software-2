from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..repositories.user import UserRepository
from ..core.auth import verify_password, create_access_token
from ..schemas.auth import UserLogin, UserRegister, Token
from ..models.user import User
from ..core.config import settings


class AuthService:
    """Service for authentication logic"""

    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def register(self, user_data: UserRegister) -> User:
        """
        Register a new user

        Args:
            user_data: User registration data

        Returns:
            Created user

        Raises:
            HTTPException: If email already exists
        """
        # Check if user already exists
        if self.user_repo.exists(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user
        user = self.user_repo.create(
            email=user_data.email,
            password=user_data.password,
            name=user_data.name
        )

        return user

    def login(self, credentials: UserLogin) -> Token:
        """
        Authenticate user and return token

        Args:
            credentials: User login credentials

        Returns:
            Access token

        Raises:
            HTTPException: If credentials are invalid
        """
        # Get user by email
        user = self.user_repo.get_by_email(credentials.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password
        if not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id},
            expires_delta=access_token_expires
        )

        return Token(access_token=access_token)

    def get_current_user_info(self, user_id: int) -> User:
        """
        Get current user information

        Args:
            user_id: User ID from token

        Returns:
            User information

        Raises:
            HTTPException: If user not found
        """
        user = self.user_repo.get_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return user
