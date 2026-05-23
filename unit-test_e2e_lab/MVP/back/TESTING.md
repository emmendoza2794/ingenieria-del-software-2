# Testing — MVP Back (FastAPI)

Suite de pruebas del backend. Cubre tres niveles de la pirámide de testing: **unitarias**, **integración** y —a nivel de setup— el contrato que consumen los tests E2E del front.

---

## Requisitos

```bash
# Instalar dependencias (incluye pytest, freezegun, pytest-playwright)
poetry install

# Activar el entorno virtual
source .venv/bin/activate   # Linux / macOS
.venv\Scripts\activate      # Windows
```

Paquetes de testing relevantes instalados por poetry:
- `pytest` + `pytest-cov` — runner y cobertura
- `freezegun` — congelar el tiempo en tests de JWT
- `pytest-playwright` — requerido solo si se corren tests de E2E desde el back (actualmente los E2E están en el front)

---

## Estructura

```
back/
├── pytest.ini                   ← configuración de pytest
├── tests/
│   ├── conftest.py              ← fixtures globales (vacío, pytest.ini maneja pythonpath)
│   ├── unit/
│   │   ├── test_password.py     ← 8 tests — hash y verificación de contraseñas
│   │   └── test_jwt.py          ← 9 tests — creación y decodificación de tokens
│   └── integration/
│       ├── conftest.py          ← fixtures: DB en memoria, cliente HTTP, reset de rate limiter
│       └── test_auth.py         ← 21 tests — endpoints POST /auth/register, POST /auth/login, GET /auth/me
```

---

## Comandos

### Correr toda la suite

```bash
.venv/bin/python -m pytest
```

### Solo tests unitarios

```bash
.venv/bin/python -m pytest tests/unit/
```

### Solo tests de integración

```bash
.venv/bin/python -m pytest tests/integration/
```

### Con reporte de cobertura

```bash
.venv/bin/python -m pytest --cov=src --cov-report=term-missing
```

### Correr un archivo específico

```bash
.venv/bin/python -m pytest tests/unit/test_jwt.py
```

### Correr un test específico por nombre

```bash
.venv/bin/python -m pytest -k "test_token_expirado"
```

---

## Tests unitarios

Los tests unitarios prueban funciones puras de `src/core/auth.py` de forma aislada, sin base de datos ni HTTP.

### `tests/unit/test_password.py` — 8 tests

Prueba las funciones `hash_password` y `verify_password`.

| Test | Qué verifica |
|------|-------------|
| `test_hash_no_es_texto_plano` | El hash nunca iguala la contraseña original |
| `test_hash_es_string` | El resultado es un `str` (no bytes ni None) |
| `test_hash_genera_resultado_diferente_cada_vez` | bcrypt usa salt aleatorio: dos hashes del mismo texto son distintos |
| `test_verify_password_correcto` | Contraseña correcta retorna `True` |
| `test_verify_password_incorrecto` | Contraseña equivocada retorna `False` |
| `test_verify_password_vacio_falla` | Cadena vacía no coincide con ningún hash |
| `test_verify_password_respeta_mayusculas` | El hash es case-sensitive |
| `test_verify_password_respeta_espacios` | Los espacios son parte de la contraseña |

### `tests/unit/test_jwt.py` — 9 tests

Prueba las funciones `create_access_token` y `decode_access_token`. Usa **freezegun** para simular el paso del tiempo sin esperar realmente.

| Test | Qué verifica |
|------|-------------|
| `test_token_contiene_payload_correcto` | El token decodificado incluye los datos originales |
| `test_token_contiene_campo_exp` | Todo JWT válido tiene fecha de expiración (`exp`) |
| `test_token_con_expiracion_personalizada` | `expires_delta` se respeta |
| `test_token_es_string` | `create_access_token` retorna `str` |
| `test_token_expirado_lanza_401` | Token expirado lanza `HTTPException(401)` — tiempo simulado con `freeze_time` |
| `test_token_manipulado_lanza_401` | Cualquier modificación al token invalida la firma |
| `test_token_con_clave_incorrecta_lanza_401` | Token firmado con clave diferente es rechazado |
| `test_token_vacio_lanza_401` | String vacío lanza `HTTPException(401)` |
| `test_token_basura_lanza_401` | Cadena que no es JWT lanza `HTTPException(401)` |

---

## Tests de integración

Los tests de integración prueban los endpoints HTTP completos usando **FastAPI TestClient** con una base de datos **SQLite en memoria** aislada. Cada test arranca con la BD limpia.

### Fixtures (`tests/integration/conftest.py`)

```
engine (SQLite :memory: + StaticPool)
    └── db_session   ← crea/destruye tablas por cada test
            └── client   ← TestClient que:
                          - sobreescribe get_db con db_session
                          - resetea el rate limiter de slowapi
                          - usa raise_server_exceptions=False
```

- **StaticPool**: fuerza a que todas las conexiones compartan la misma BD en memoria (necesario para SQLite).
- **reset del rate limiter**: evita que los 10 req/min de slowapi acumulen entre tests.
- **raise_server_exceptions=False**: las excepciones no capturadas del servidor devuelven 500 en lugar de relanzarse al test.

### `tests/integration/test_auth.py` — 21 tests

#### `POST /auth/register`

| Test | Esperado |
|------|---------|
| `test_registro_exitoso_devuelve_201` | 201 Created |
| `test_registro_devuelve_datos_del_usuario` | Body con `email`, `name`, `id` |
| `test_registro_no_expone_password` | Sin `password` ni `hashed_password` en respuesta |
| `test_registro_email_duplicado_devuelve_400` | 400 con `already registered` |
| `test_registro_email_invalido_devuelve_error` | >= 400 (ValidationError no capturada → 500) |
| `test_registro_sin_campos_devuelve_422` | 422 Unprocessable Entity |

#### `POST /auth/login`

| Test | Esperado |
|------|---------|
| `test_login_exitoso_devuelve_token` | 200 con `access_token` y `token_type: bearer` |
| `test_login_password_incorrecto_devuelve_401` | 401 |
| `test_login_email_inexistente_devuelve_401` | 401 |
| `test_login_indica_intentos_restantes` | 401 con mensaje que menciona `attempt` |
| `test_login_bloqueo_al_tercer_intento_devuelve_429` | 429 tras 3 intentos fallidos |
| `test_login_bloqueo_mensaje_incluye_minutos` | 429 con `minute` o `locked` en el mensaje |
| `test_login_bloqueo_progresivo_intento_4_bloquea_2_minutos` | El 4.° intento bloquea ~2 min |
| `test_login_exitoso_resetea_intentos_fallidos` | `failed_login_attempts = 0` tras login correcto |
| `test_login_cuenta_bloqueada_devuelve_429` | 429 si `locked_until` es futuro |
| `test_login_sin_campos_devuelve_422` | 422 |

#### `GET /auth/me`

| Test | Esperado |
|------|---------|
| `test_get_me_con_token_valido_devuelve_200` | 200 |
| `test_get_me_devuelve_datos_correctos` | Body con `email` y `name` correctos |
| `test_get_me_sin_token_devuelve_403` | 403 |
| `test_get_me_token_invalido_devuelve_401` | 401 |
| `test_get_me_token_mal_formado_devuelve_401` | 401 |

---

## Resetear bloqueos durante pruebas manuales

El bloqueo progresivo persiste en `app.db`. Cuando estés probando en el navegador y quieras reiniciar el estado de un usuario sin esperar los minutos de bloqueo, usa el script incluido en `scripts/reset_user.py`.

### Ver el estado de todos los usuarios

```bash
# Desde MVP/back/
poetry run python scripts/reset_user.py
```

Salida ejemplo:
```
ID    Email                               Intentos   Bloqueado hasta
----------------------------------------------------------------------
1     tu@email.com                        6          2026-05-23 02:32:59
```

### Resetear un usuario específico

```bash
poetry run python scripts/reset_user.py tu@email.com
# ✓ Usuario 'tu@email.com' reseteado: intentos=0, bloqueo eliminado.
```

### Borrar toda la base de datos

Si quieres empezar desde cero (se pierden todos los usuarios registrados):

```bash
rm app.db
# El back la recrea automáticamente al reiniciar
```

---

## Configuración (`pytest.ini`)

```ini
[pytest]
testpaths = tests      # directorio raíz de los tests
pythonpath = .         # permite imports como `from src.core.auth import ...`
addopts = -v --tb=short
```

---

## Notas técnicas

- **bcrypt**: fijado en `==4.0.1` por incompatibilidad de `passlib 1.7.4` con `bcrypt >= 4.1`.
- **python-jose**: manejo de JWT. `pyjwt` también está en el proyecto pero `python-jose` es el que usa `src/core/auth.py`.
- **slowapi**: rate limiting en `POST /auth/register` (5 req/min por IP). El login no tiene rate limit de slowapi — el bloqueo de cuenta lo protege solo. En tests de integración se resetea el limiter entre tests con `limiter._storage.reset()`.
- **Bloqueo progresivo**: a partir del 3.° intento fallido. Fórmula: `minutos = intentos_fallidos - 2` (intento 3 → 1 min, intento 4 → 2 min…). Cada intento adicional mientras la cuenta está bloqueada incrementa el contador y extiende el bloqueo inmediatamente, sin necesidad de esperar a que expire.
