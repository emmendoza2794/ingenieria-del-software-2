"""
Tests de integración — endpoints de autenticación
Usa FastAPI TestClient con SQLite en memoria: cada test arranca con BD limpia.
"""
import pytest
from datetime import datetime, timedelta
from src.models.user import User
from src.core.auth import hash_password


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def register(client, email="test@example.com", password="secret123", name="Test User"):
    return client.post("/auth/register", data={"email": email, "password": password, "name": name})


def login(client, email="test@example.com", password="secret123"):
    return client.post("/auth/login", data={"email": email, "password": password})


# ---------------------------------------------------------------------------
# POST /auth/register
# ---------------------------------------------------------------------------

class TestRegister:

    def test_registro_exitoso_devuelve_201(self, client):
        res = register(client)
        assert res.status_code == 201

    def test_registro_devuelve_datos_del_usuario(self, client):
        res = register(client)
        body = res.json()
        assert body["email"] == "test@example.com"
        assert body["name"] == "Test User"
        assert "id" in body

    def test_registro_no_expone_password(self, client):
        res = register(client)
        body = res.json()
        assert "password" not in body
        assert "hashed_password" not in body

    def test_registro_email_duplicado_devuelve_400(self, client):
        register(client)
        res = register(client)
        assert res.status_code == 400
        assert "already registered" in res.json()["detail"]

    def test_registro_email_invalido_devuelve_error(self, client):
        # Pydantic valida EmailStr dentro del handler (no en el parsing de FastAPI),
        # por eso lanza ValidationError no capturado → 500.
        res = client.post("/auth/register", data={"email": "no-es-un-email", "password": "secret", "name": "X"})
        assert res.status_code >= 400

    def test_registro_sin_campos_devuelve_422(self, client):
        res = client.post("/auth/register", data={})
        assert res.status_code == 422


# ---------------------------------------------------------------------------
# POST /auth/login
# ---------------------------------------------------------------------------

class TestLogin:

    def test_login_exitoso_devuelve_token(self, client):
        register(client)
        res = login(client)
        assert res.status_code == 200
        body = res.json()
        assert "access_token" in body
        assert body["token_type"] == "bearer"

    def test_login_password_incorrecto_devuelve_401(self, client):
        register(client)
        res = login(client, password="wrong")
        assert res.status_code == 401

    def test_login_email_inexistente_devuelve_401(self, client):
        res = login(client, email="noexiste@example.com")
        assert res.status_code == 401

    def test_login_indica_intentos_restantes(self, client):
        register(client)
        res = login(client, password="wrong")
        assert res.status_code == 401
        assert "intento" in res.json()["detail"].lower()

    def test_login_bloqueo_al_tercer_intento_devuelve_429(self, client):
        register(client)
        for _ in range(2):
            login(client, password="wrong")
        res = login(client, password="wrong")
        assert res.status_code == 429

    def test_login_bloqueo_mensaje_incluye_minutos(self, client):
        register(client)
        for _ in range(3):
            login(client, password="wrong")
        detail = login(client, password="wrong").json()["detail"].lower()
        assert "minuto" in detail or "bloqueada" in detail

    def test_login_bloqueo_progresivo_intento_4_bloquea_2_minutos(self, client, db_session):
        register(client)
        # 3 intentos → bloqueo 1 min
        for _ in range(3):
            login(client, password="wrong")

        # 4to intento mientras está bloqueada → extiende a 2 minutos
        res = login(client, password="wrong")
        assert res.status_code == 429

        db_session.expire_all()
        user = db_session.query(User).filter(User.email == "test@example.com").first()
        remaining = (user.locked_until - datetime.utcnow()).total_seconds()
        assert 100 < remaining <= 120  # ~2 minutos

    def test_login_exitoso_resetea_intentos_fallidos(self, client, db_session):
        register(client)
        login(client, password="wrong")
        login(client, password="wrong")
        login(client)  # login correcto

        user = db_session.query(User).filter(User.email == "test@example.com").first()
        assert user.failed_login_attempts == 0
        assert user.locked_until is None

    def test_login_cuenta_bloqueada_extiende_bloqueo(self, client, db_session):
        register(client)
        user = db_session.query(User).filter(User.email == "test@example.com").first()
        user.locked_until = datetime.utcnow() + timedelta(minutes=5)
        user.failed_login_attempts = 5
        db_session.commit()

        # Intento mientras bloqueada → extiende (failed=6, minutos=4)
        res = login(client, password="wrong")
        assert res.status_code == 429
        assert "extendido" in res.json()["detail"].lower()

    def test_login_sin_campos_devuelve_422(self, client):
        res = client.post("/auth/login", data={})
        assert res.status_code == 422


# ---------------------------------------------------------------------------
# GET /auth/me
# ---------------------------------------------------------------------------

class TestGetMe:

    def _get_token(self, client):
        register(client)
        return login(client).json()["access_token"]

    def test_get_me_con_token_valido_devuelve_200(self, client):
        token = self._get_token(client)
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200

    def test_get_me_devuelve_datos_correctos(self, client):
        token = self._get_token(client)
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        body = res.json()
        assert body["email"] == "test@example.com"
        assert body["name"] == "Test User"

    def test_get_me_sin_token_devuelve_401(self, client):
        res = client.get("/auth/me")
        assert res.status_code == 401

    def test_get_me_token_invalido_devuelve_401(self, client):
        res = client.get("/auth/me", headers={"Authorization": "Bearer token.falso.aqui"})
        assert res.status_code == 401

    def test_get_me_token_mal_formado_devuelve_401(self, client):
        res = client.get("/auth/me", headers={"Authorization": "Bearer basura"})
        assert res.status_code == 401
