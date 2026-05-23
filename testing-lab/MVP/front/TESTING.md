# Testing — MVP Front (Nuxt 3)

Suite de pruebas **End-to-End (E2E)** del frontend usando **Playwright**. Los tests abren un navegador real (Chromium headless), interactúan con la interfaz y verifican el comportamiento desde el punto de vista del usuario.

---

## Requisitos

### Dependencias

```bash
bun install
```

`@playwright/test` está en `devDependencies`. Si es la primera vez que se instala, también hay que bajar los navegadores:

```bash
npx playwright install chromium
```

### Servicios corriendo

Los tests E2E requieren que **ambos servicios estén activos** antes de ejecutarlos:

| Servicio | URL | Cómo arrancarlo |
|----------|-----|-----------------|
| Back (FastAPI) | `http://localhost:8000` | `cd back && poetry run uvicorn src.main:app --reload` |
| Front (Nuxt) | `http://localhost:3000` | `cd front && bun run dev` |

Arranque rápido con ambos a la vez:

```bash
# Desde MVP/
./dev.sh
```

---

## Estructura

```
front/
├── playwright.config.js         ← configuración de Playwright
└── tests/e2e/
    ├── helpers.js               ← funciones compartidas (apiRegister, goToLogin, etc.)
    ├── login.spec.js            ← 11 tests — flujo de login
    └── register.spec.js         ← 7 tests — flujo de registro
```

---

## Comandos

### Correr todos los tests (headless)

```bash
bun run test:e2e
```

### Con el navegador visible (para ver qué hace el test)

```bash
bun run test:e2e:headed
```

### Con la interfaz gráfica de Playwright

```bash
bun run test:e2e:ui
```

### Correr un archivo específico

```bash
npx playwright test login.spec.js
npx playwright test register.spec.js
```

### Correr un test específico por nombre

```bash
npx playwright test -g "redirige a / con credenciales válidas"
```

### Ver el reporte HTML tras la ejecución

```bash
npx playwright show-report
```

---

## Configuración (`playwright.config.js`)

| Opción | Valor | Descripción |
|--------|-------|-------------|
| `testDir` | `./tests/e2e` | Carpeta de los tests |
| `baseURL` | `http://localhost:3000` | URL base del front |
| `timeout` | 15 000 ms | Tiempo máximo por test |
| `expect.timeout` | 6 000 ms | Tiempo máximo por aserción |
| `headless` | `true` | Sin ventana visible (cambiar a `false` para debug) |
| `video` | `retain-on-failure` | Graba video solo si el test falla |
| `screenshot` | `only-on-failure` | Captura solo si el test falla |
| `fullyParallel` | `false` | Tests secuenciales (evita conflictos en la BD compartida) |

---

## Helpers (`tests/e2e/helpers.js`)

Funciones utilitarias usadas por todos los specs:

| Función | Descripción |
|---------|-------------|
| `apiRegister(email, password, name)` | Registra un usuario directo contra la API (sin pasar por el front). Se usa en `beforeAll`/`beforeEach` para preparar estado. |
| `uniqueSuffix()` | Genera un sufijo aleatorio de 6 caracteres para evitar colisiones de email entre ejecuciones. |
| `goToLogin(page)` | Navega a `/login` y espera a que `#form-login` sea visible. |
| `goToRegister(page)` | Navega a `/login`, hace clic en el tab registro y espera `#form-register`. |

---

## Tests de login (`login.spec.js`) — 11 tests

Un usuario de prueba se registra una vez vía `beforeAll` y se reutiliza en todos los tests del archivo. Los tests de bloqueo usan un usuario fresco creado en `beforeEach`.

### Página de login (3 tests)

| Test | Qué verifica |
|------|-------------|
| `muestra el formulario de login al cargar` | `#form-login`, `#login-email`, `#login-password` y `#btn-login` son visibles |
| `el tab de registro muestra el formulario de registro` | Clic en `#tab-register` → `#form-register` visible, `#form-login` oculto |
| `volver al tab de login oculta el registro` | Clic en `#tab-login` → vuelve al estado inicial |

### Login exitoso (2 tests)

| Test | Qué verifica |
|------|-------------|
| `redirige a / con credenciales válidas` | Tras login correcto, `page.url()` es `http://localhost:3000/` |
| `guarda el token en localStorage tras login exitoso` | `localStorage.getItem('auth_token')` no es `null` y tiene más de 20 caracteres |

### Login fallido (4 tests)

| Test | Qué verifica |
|------|-------------|
| `muestra error con password incorrecto` | `#login-error` se vuelve visible |
| `el mensaje de error menciona intentos restantes` | El texto de `#login-error` contiene `attempt` o `incorrect` |
| `campos vacíos no muestran error del servidor` | Sin llenar campos, `#login-error` permanece oculto (validación frontend) |
| `email con formato inválido no llama a la API` | Email sin `@` no dispara llamada al back, `#login-error` permanece oculto |

### Bloqueo de cuenta (2 tests)

Cada test crea su propio usuario fresco para no afectar al usuario compartido.

| Test | Qué verifica |
|------|-------------|
| `3 intentos fallidos muestran mensaje de bloqueo` | Tras 3 intentos fallidos, `#login-error` contiene `locked` o `minute` |
| `cuenta bloqueada rechaza incluso el password correcto` | Mientras la cuenta está bloqueada, incluso con credenciales correctas aparece el mensaje de bloqueo |

---

## Tests de registro (`register.spec.js`) — 7 tests

Un usuario existente se registra vía `beforeAll` para probar el caso de email duplicado.

### Formulario de registro (3 tests)

| Test | Qué verifica |
|------|-------------|
| `el tab registro muestra el formulario` | `#reg-name`, `#reg-email`, `#btn-register` son visibles tras cambiar de tab |
| `campos vacíos no envían el formulario` | Sin llenar nada, la URL sigue siendo `/login` (validación frontend) |
| `passwords que no coinciden no envían el formulario` | Con contraseñas distintas, la URL sigue siendo `/login` |

### Registro exitoso (2 tests)

| Test | Qué verifica |
|------|-------------|
| `muestra diálogo de confirmación` | Tras registro correcto, aparece el texto "Registro exitoso" en un diálogo |
| `el botón Entendido cierra el diálogo y vuelve al login` | Clic en "Entendido" → `#form-login` es visible |

### Registro fallido (2 tests)

| Test | Qué verifica |
|------|-------------|
| `email duplicado muestra error en toast` | Registrar un email ya existente muestra un `[role="alert"]` (PrimeVue Toast) |
| `password menor a 6 caracteres no pasa validación frontend` | Con password corto, la URL sigue siendo `/login` |

---

## Selectores usados

Los tests interactúan con el DOM a través de estos identificadores definidos en `login.vue`:

| Selector | Elemento |
|----------|---------|
| `#form-login` | Formulario de login |
| `#form-register` | Formulario de registro |
| `#tab-login` | Botón tab "Inicia sesión" |
| `#tab-register` | Botón tab "Regístrate" |
| `#login-email` | Input email del login |
| `#login-password` | Input password del login |
| `#btn-login` | Botón "Iniciar sesión" |
| `#login-error` | Mensaje de error del servidor (PrimeVue `<Message>`) |
| `#reg-name` | Input nombre del registro |
| `#reg-email` | Input email del registro |
| `#reg-password` | Input password del registro (PrimeVue `<Password>`) |
| `#reg-confirm` | Input confirmar password |
| `#btn-register` | Botón "Crear cuenta" |
| `[role="alert"]` | Toast de PrimeVue (errores de registro) |

---

## Notas

- Los tests son **secuenciales** (`fullyParallel: false`) para evitar que múltiples instancias del navegador saturen el rate limiter del back (10 req/min en `/auth/login`).
- Cada test de bloqueo usa un usuario único generado con `uniqueSuffix()` para no contaminar el estado de otros tests.
- Los videos y capturas de pantalla de los tests fallidos se guardan en `test-results/`.
