"""
Resetea el bloqueo de un usuario en la BD.
Uso:  poetry run python scripts/reset_user.py <email>
      poetry run python scripts/reset_user.py          # lista todos los usuarios
"""
import sys
from pathlib import Path

# Permite importar src.* sin instalar el paquete
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.models.user import User
from src.core.config import settings

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
Session = sessionmaker(bind=engine)


def listar():
    with Session() as db:
        users = db.query(User).all()
        if not users:
            print("No hay usuarios en la BD.")
            return
        print(f"{'ID':<5} {'Email':<35} {'Intentos':<10} {'Bloqueado hasta'}")
        print("-" * 70)
        for u in users:
            print(f"{u.id:<5} {u.email:<35} {u.failed_login_attempts:<10} {u.locked_until or '-'}")


def resetear(email: str):
    with Session() as db:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Usuario '{email}' no encontrado.")
            return
        user.failed_login_attempts = 0
        user.locked_until = None
        db.commit()
        print(f"✓ Usuario '{email}' reseteado: intentos=0, bloqueo eliminado.")


if __name__ == "__main__":
    if len(sys.argv) == 1:
        listar()
    else:
        resetear(sys.argv[1])
