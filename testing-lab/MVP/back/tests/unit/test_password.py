"""
Pruebas unitarias para hash_password y verify_password (src/core/auth.py).

Conceptos:
- Patrón AAA: Arrange / Act / Assert
- Camino feliz (happy path): entrada válida → resultado correcto
- Camino triste (sad path): entrada incorrecta → resultado negativo esperado
"""
from src.core.auth import hash_password, verify_password


def test_hash_no_es_texto_plano():
    # El hash nunca debe igualar la contraseña original
    hashed = hash_password("secreto123")
    assert hashed != "secreto123"


def test_hash_es_string():
    # El resultado debe ser un string (no bytes ni None)
    hashed = hash_password("cualquier_clave")
    assert isinstance(hashed, str)


def test_hash_genera_resultado_diferente_cada_vez():
    # bcrypt usa un salt aleatorio: dos hashes del mismo texto son distintos
    hash1 = hash_password("misma_clave")
    hash2 = hash_password("misma_clave")
    assert hash1 != hash2


def test_verify_password_correcto():
    # Contraseña correcta debe retornar True
    hashed = hash_password("mi_password")
    assert verify_password("mi_password", hashed) is True


def test_verify_password_incorrecto():
    # Contraseña equivocada debe retornar False
    hashed = hash_password("mi_password")
    assert verify_password("password_incorrecto", hashed) is False


def test_verify_password_vacio_falla():
    # Una cadena vacía no debe coincidir con ningún hash
    hashed = hash_password("mi_password")
    assert verify_password("", hashed) is False


def test_verify_password_respeta_mayusculas():
    # El hash es case-sensitive
    hashed = hash_password("Password123")
    assert verify_password("password123", hashed) is False
    assert verify_password("Password123", hashed) is True


def test_verify_password_respeta_espacios():
    # Los espacios son parte de la contraseña y deben conservarse
    hashed = hash_password("  con espacios  ")
    assert verify_password("  con espacios  ", hashed) is True
    assert verify_password("con espacios", hashed) is False
