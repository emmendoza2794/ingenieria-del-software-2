from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from ..models.user import User
from ..core.auth import hash_password


class UserRepository:
    """Repository for user data access"""

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create(self, email: str, password: str, name: str) -> User:
        db_user = User(
            email=email,
            name=name,
            hashed_password=hash_password(password)
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def exists(self, email: str) -> bool:
        return self.db.query(User).filter(User.email == email).first() is not None

    def increment_failed_attempts(self, user: User) -> User:
        user.failed_login_attempts += 1
        self.db.commit()
        self.db.refresh(user)
        return user

    def lock_account(self, user: User, minutes: int) -> User:
        user.locked_until = datetime.utcnow() + timedelta(minutes=minutes)
        self.db.commit()
        self.db.refresh(user)
        return user

    def reset_failed_attempts(self, user: User) -> User:
        user.failed_login_attempts = 0
        user.locked_until = None
        self.db.commit()
        self.db.refresh(user)
        return user
