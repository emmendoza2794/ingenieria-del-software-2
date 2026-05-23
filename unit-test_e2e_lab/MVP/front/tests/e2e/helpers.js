/**
 * Helpers compartidos para los tests E2E.
 * Todos los tests asumen que ambos servicios están corriendo:
 *   - Back:  http://localhost:8000
 *   - Front: http://localhost:3000
 */

const API_URL = 'http://localhost:8000'

/**
 * Registra un usuario directo contra la API (sin pasar por el front).
 * Se usa en fixtures para preparar estado antes del test.
 */
export async function apiRegister(email, password, name) {
  const body = new URLSearchParams({ email, password, name })
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (res.status !== 201) {
    const text = await res.text()
    throw new Error(`apiRegister falló (${res.status}): ${text}`)
  }
}

/**
 * Genera un sufijo único para evitar colisiones de email entre ejecuciones.
 */
export function uniqueSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

/**
 * Navega a /login y espera a que el formulario de login esté listo.
 */
export async function goToLogin(page) {
  await page.goto('/login')
  await page.waitForSelector('#form-login', { state: 'visible' })
}

/**
 * Navega a /login y cambia al tab de registro.
 */
export async function goToRegister(page) {
  await page.goto('/login')
  await page.waitForSelector('#tab-register', { state: 'visible' })
  await page.click('#tab-register')
  await page.waitForSelector('#form-register', { state: 'visible' })
}
