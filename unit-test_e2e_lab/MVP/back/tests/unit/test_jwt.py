"""
Pruebas unitarias para create_access_token y decode_access_token (src/core/auth.py).

Conceptos:
- pytest.raises: verificar que se lanza la excepción correcta
- freezegun: congelar el tiempo para simular tokens expirados
- Caminos de error del JWT: expirado, manipulado, firmado con clave incorrecta
"""
import pytest
import jwt as pyjwt
from datetime import datetime, timedelta
from freezegun import freeze_time
from fastapi import HTTPException

from src.core.auth import create_access_token, decode_access_token
from src.core.config import settings


# ── Pruebas de create_access_token ──────────────────────────────────────────

def test_token_contiene_payload_correcto():
    # El token decodificado debe incluir los datos originales
    payload = {"sub": "ana@ejemplo.com", "user_id": 42}
    token = create_access_token(data=payload)
    decoded = decode_access_token(token)

    assert decoded["sub"] == "ana@ejemplo.com"
    assert decoded["user_id"] == 42


def test_token_contiene_campo_exp():
    # Todo JWT válido debe tener fecha de expiración
    token = create_access_token(data={"sub": "x@x.com"})
    decoded = decode_access_token(token)

    assert "exp" in decoded


def test_token_con_expiracion_personalizada():
    # expires_delta debe respetarse y el token debe ser válido dentro del período
    token = create_access_token(
        data={"sub": "usuario@test.com"},
        expires_delta=timedelta(hours=2)
    )
    decoded = decode_access_token(token)

    assert decoded["sub"] == "usuario@test.com"


def test_token_es_string():
    token = create_access_token(data={"sub": "test@test.com"})
    assert isinstance(token, str)


# ── Pruebas de decode_access_token ──────────────────────────────────────────

def test_token_expirado_lanza_401():
    # Crear un token que expira en 1 segundo y luego viajar al futuro
    token = create_access_token(
        data={"sub": "usuario@test.com"},
        expires_delta=timedelta(seconds=1)
    )

    # Simular que estamos 1 hora después: el token ya expiró
    tiempo_futuro = datetime.utcnow() + timedelta(hours=1)
    with freeze_time(tiempo_futuro):
        with pytest.raises(HTTPException) as exc_info:
            decode_access_token(token)

    assert exc_info.value.status_code == 401
    assert "expired" in exc_info.value.detail.lower()


def test_token_manipulado_lanza_401():
    # Cualquier modificación al token lo invalida (firma rota)
    token = create_access_token(data={"sub": "legit@test.com"})
    token_corrupto = token + "XXXXXX"

    with pytest.raises(HTTPException) as exc_info:
        decode_access_token(token_corrupto)

    assert exc_info.value.status_code == 401


def test_token_con_clave_incorrecta_lanza_401():
    # Un token firmado con una clave distinta debe ser rechazado
    payload_falso = {"sub": "atacante@test.com", "exp": 9999999999}
    token_falso = pyjwt.encode(
        payload_falso,
        key="clave_completamente_diferente",
        algorithm=settings.JWT_ALGORITHM
    )

    with pytest.raises(HTTPException) as exc_info:
        decode_access_token(token_falso)

    assert exc_info.value.status_code == 401


def test_token_vacio_lanza_401():
    with pytest.raises(HTTPException) as exc_info:
        decode_access_token("")

    assert exc_info.value.status_code == 401


def test_token_basura_lanza_401():
    with pytest.raises(HTTPException) as exc_info:
        decode_access_token("esto.no.es.un.jwt")

    assert exc_info.value.status_code == 401
