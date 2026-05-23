# Testing — MVP Front (Nuxt 3)

Suite de pruebas **End-to-End (E2E)** del frontend usando **Playwright**. Los tests abren un navegador real (Chromium), interactúan con la interfaz y verifican el comportamiento desde el punto de vista del usuario.

---

## Requisitos

### Dependencias

```bash
bun install
```

`@playwright/test` está en `devDependencies`. Si es la primera vez, hay que bajar los navegadores:

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

### Estado limpio antes de correr

Si la base de datos tiene usuarios bloqueados o se llegó al rate limit de registro, resetear el estado antes de ejecutar los tests:

```bash
# Desde MVP/back/
rm app.db          # borra todos los usuarios
# el back recrea la BD al reiniciar
```

---

## Estructura

```
front/
├── playwright.config.js         ← configuración de Playwright
└── tests/e2e/
    ├── helpers.js               ← funciones compartidas (apiRegister, goToLogin, etc.)
    ├── login.spec.js            ← 3 tests — flujo de login
    └── register.spec.js         ← 2 tests — flujo de registro
```

---

## Comandos

### Con el navegador visible — modo demo

```bash
bun run test:e2e:headed
```

Abre Chromium con `slowMo: 1500 ms` entre cada acción para ver cada paso claramente.

### Headless (sin ventana)

```bash
bun run test:e2e
```

### Correr un archivo específico

```bash
npx playwright test login.spec.js
npx playwright test register.spec.js
```

---

## Configuración (`playwright.config.js`)

| Opción | Valor | Descripción |
|--------|-------|-------------|
| `testDir` | `./tests/e2e` | Carpeta de los tests |
| `baseURL` | `http://localhost:3000` | URL base del front |
| `timeout` | 30 000 ms | Tiempo máximo por test |
| `expect.timeout` | 8 000 ms | Tiempo máximo por aserción |
| `headless` | `false` | Navegador visible |
| `slowMo` | `1 500 ms` | Pausa entre cada acción |
| `workers` | `1` | Un test a la vez (evita conflictos con la BD y el rate limiter) |
| `video` | `retain-on-failure` | Graba video solo si el test falla |
| `screenshot` | `only-on-failure` | Captura solo si el test falla |

---

## Helpers (`tests/e2e/helpers.js`)

| Función | Descripción |
|---------|-------------|
| `apiRegister(email, password, name)` | Registra un usuario directo contra la API (sin el front). Acepta 201 (creado) o 400 (ya existe). Usado en `beforeAll` para preparar estado. |
| `uniqueSuffix()` | Genera un sufijo aleatorio de 6 caracteres para evitar colisiones de email entre ejecuciones. |
| `goToLogin(page)` | Navega a `/login` con `waitUntil: 'load'` y espera a que Vue hidrate antes de retornar. |
| `goToRegister(page)` | Navega a `/login`, espera hidratación, y hace clic en el tab "Regístrate". |

> **Por qué `waitUntil: 'load'`**: Nuxt 3 sirve el HTML inicial por SSR antes de que Vue hidrate en el cliente. Sin esta espera, Playwright puede intentar hacer clic en botones cuyo handler `@click` todavía no está conectado.

---

## Tests de login (`login.spec.js`) — 3 tests

Un usuario de prueba se registra vía API en `beforeAll` y se reutiliza en los tres tests.

| Test | Qué verifica |
|------|-------------|
| `muestra el formulario de login` | `#form-login`, `#login-email`, `#login-password` y `#btn-login` son visibles al cargar |
| `login exitoso redirige a /` | Con credenciales válidas, la URL cambia a `http://localhost:3000/` |
| `login fallido muestra mensaje de error` | Con password incorrecto, `#login-error` se vuelve visible |

---

## Tests de registro (`register.spec.js`) — 2 tests

| Test | Qué verifica |
|------|-------------|
| `muestra el formulario de registro` | Tras clic en tab "Regístrate", aparecen `#reg-name`, `#reg-email`, `#reg-password`, `#reg-confirm` y `#btn-register` |
| `registro exitoso muestra diálogo de confirmación` | Llenar el formulario con datos válidos y enviar muestra el texto "Registro exitoso" |

---

## Selectores usados

Los tests interactúan con el DOM a través de estos IDs definidos en `login.vue`:

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

---

## Notas

- **Un worker**: `workers: 1` garantiza que los tests corran de a uno para no saturar el rate limiter del back ni generar condiciones de carrera en la BD.
- **Estado limpio**: El `beforeAll` de login registra un usuario con email aleatorio; si la BD fue reseteada antes de correr, siempre se crea desde cero.
- Los videos y capturas de los tests fallidos se guardan en `test-results/`.
