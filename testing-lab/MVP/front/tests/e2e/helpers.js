/**
 * Helpers compartidos para los tests E2E.
 * Requiere back en :8000 y front en :3000
 */

const API_URL = 'http://localhost:8000'

export async function apiRegister(email, password, name) {
  const body = new URLSearchParams({ email, password, name })
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  // 201 = creado, 400 = ya existe (ambos son OK para setup)
  if (res.status !== 201 && res.status !== 400) {
    const text = await res.text()
    throw new Error(`apiRegister falló (${res.status}): ${text}`)
  }
}

export function uniqueSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

// Espera a que Vue hidrate: el bundle carga con 'load', pero los handlers
// @click/@submit se conectan en microtareas posteriores. 1 s es suficiente.
async function waitForHydration(page) {
  await page.waitForTimeout(1000)
}

export async function goToLogin(page) {
  await page.goto('/login', { waitUntil: 'load' })
  await waitForHydration(page)
  await page.waitForSelector('#btn-login', { state: 'visible' })
}

export async function goToRegister(page) {
  await page.goto('/login', { waitUntil: 'load' })
  await waitForHydration(page)
  await page.waitForSelector('#tab-register', { state: 'visible' })
  await page.click('#tab-register')
  await page.waitForSelector('#form-register', { state: 'visible' })
}
