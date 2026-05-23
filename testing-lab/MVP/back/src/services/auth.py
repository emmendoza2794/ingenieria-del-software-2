from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..repositories.user import UserRepository
from ..core.auth import verify_password, create_access_token
from ..schemas.auth import UserLogin, UserRegister, Token
from ..models.user import User
from ..core.config import settings

# A partir del 3er intento fallido se bloquea la cuenta.
# Fórmula del bloqueo: minutos = intentos_fallidos - 2
# Intento 3 → 1 min, intento 4 → 2 min, intento 5 → 3 min, ...
LOCKOUT_THRESHOLD = 3


class AuthService:

    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def register(self, user_data: UserRegister) -> User:
        if self.user_repo.exists(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        return self.user_repo.create(
            email=user_data.email,
            password=user_data.password,
            name=user_data.name
        )

    def login(self, credentials: UserLogin) -> Token:
        user = self.user_repo.get_by_email(credentials.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo o contraseña incorrectos.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verificar si la cuenta está bloqueada.
        # Cada intento mientras está bloqueada incrementa el contador y extiende el bloqueo.
        if user.locked_until and user.locked_until > datetime.utcnow():
            self.user_repo.increment_failed_attempts(user)
            lockout_minutes = user.failed_login_attempts - 2
            self.user_repo.lock_account(user, minutes=lockout_minutes)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Cuenta bloqueada. Bloqueo extendido a {lockout_minutes} minuto(s) por reintento.",
            )

        if not verify_password(credentials.password, user.hashed_password):
            self.user_repo.increment_failed_attempts(user)

            if user.failed_login_attempts >= LOCKOUT_THRESHOLD:
                lockout_minutes = user.failed_login_attempts - 2  # 3→1, 4→2, 5→3 ...
                self.user_repo.lock_account(user, minutes=lockout_minutes)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Demasiados intentos fallidos. Cuenta bloqueada por {lockout_minutes} minuto(s).",
                )

            remaining_attempts = LOCKOUT_THRESHOLD - user.failed_login_attempts
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Correo o contraseña incorrectos. Te quedan {remaining_attempts} intento(s) antes del bloqueo.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Login exitoso: resetear intentos fallidos
        self.user_repo.reset_failed_attempts(user)

        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id},
            expires_delta=timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return Token(access_token=access_token)

    def get_current_user_info(self, user_id: int) -> User:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
