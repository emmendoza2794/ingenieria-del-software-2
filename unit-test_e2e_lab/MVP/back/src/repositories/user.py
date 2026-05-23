from sqlalchemy.orm import Session
from typing import Optional
from ..models.user import User
from ..core.auth import hash_password


class UserRepository:
    """Repository for user data access"""

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def create(self, email: str, password: str, name: str) -> User:
        """Create new user"""
        hashed_password = hash_password(password)
        db_user = User(
            email=email,
            name=name,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def exists(self, email: str) -> bool:
        """Check if user exists by email"""
        return self.db.query(User).filter(User.email == email).first() is not None
