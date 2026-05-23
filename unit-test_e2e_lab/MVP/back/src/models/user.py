from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..core.database import Base


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Protección contra fuerza bruta
    failed_login_attempts = Column(Integer, default=0, server_default="0", nullable=False)
    locked_until = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
