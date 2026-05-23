import { test, expect } from '@playwright/test'
import { apiRegister, uniqueSuffix, goToLogin } from './helpers.js'

/**
 * Tests E2E — flujo de login
 * Requiere: back en :8000 y front en :3000
 */

// Usuario compartido para todos los tests de este archivo
let testUser

test.beforeAll(async () => {
  const suffix = uniqueSuffix()
  testUser = {
    email: `e2e_login_${suffix}@test.com`,
    password: 'Test1234!',
    name: `E2E Login ${suffix}`,
  }
  await apiRegister(testUser.email, testUser.password, testUser.name)
})

// ---------------------------------------------------------------------------
// Página y navegación
// ---------------------------------------------------------------------------

test.describe('Página de login', () => {
  test('muestra el formulario de login al cargar', async ({ page }) => {
    await goToLogin(page)
    await expect(page.locator('#form-login')).toBeVisible()
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
    await expect(page.locator('#btn-login')).toBeVisible()
  })

  test('el tab de registro muestra el formulario de registro', async ({ page }) => {
    await goToLogin(page)
    await page.click('#tab-register')
    await expect(page.locator('#form-register')).toBeVisible()
    await expect(page.locator('#form-login')).toBeHidden()
  })

  test('volver al tab de login oculta el registro', async ({ page }) => {
    await goToLogin(page)
    await page.click('#tab-register')
    await page.click('#tab-login')
    await expect(page.locator('#form-login')).toBeVisible()
    await expect(page.locator('#form-register')).toBeHidden()
  })
})

// ---------------------------------------------------------------------------
// Login exitoso
// ---------------------------------------------------------------------------

test.describe('Login exitoso', () => {
  test('redirige a / con credenciales válidas', async ({ page }) => {
    await goToLogin(page)
    await page.fill('#login-email', testUser.email)
    await page.fill('#login-password', testUser.password)
    await page.click('#btn-login')
    await page.waitForURL('http://localhost:3000/', { timeout: 8000 })
    expect(page.url()).toBe('http://localhost:3000/')
  })

  test('guarda el token en localStorage tras login exitoso', async ({ page }) => {
    await goToLogin(page)
    await page.fill('#login-email', testUser.email)
    await page.fill('#login-password', testUser.password)
    await page.click('#btn-login')
    await page.waitForURL('http://localhost:3000/', { timeout: 8000 })

    const token = await page.evaluate(() => localStorage.getItem('auth_token'))
    expect(token).not.toBeNull()
    expect(token.length).toBeGreaterThan(20)
  })
})

// ---------------------------------------------------------------------------
// Login fallido
// ---------------------------------------------------------------------------

test.describe('Login fallido', () => {
  test('muestra error con password incorrecto', async ({ page }) => {
    await goToLogin(page)
    await page.fill('#login-email', testUser.email)
    await page.fill('#login-password', 'password-incorrecta')
    await page.click('#btn-login')
    await expect(page.locator('#login-error')).toBeVisible()
  })

  test('el mensaje de error menciona intentos restantes', async ({ page }) => {
    await goToLogin(page)
    await page.fill('#login-email', testUser.email)
    await page.fill('#login-password', 'password-incorrecta')
    await page.click('#btn-login')
    await expect(page.locator('#login-error')).toBeVisible()
    const texto = await page.locator('#login-error').innerText()
    expect(texto.toLowerCase()).toMatch(/intento|incorrectos/)
  })

  test('campos vacíos no muestran error del servidor (validación frontend)', async ({ page }) => {
    await goToLogin(page)
    await page.click('#btn-login')
    await page.waitForTimeout(500)
    await expect(page.locator('#login-error')).toBeHidden()
  })

  test('email con formato inválido no llama a la API', async ({ page }) => {
    await goToLogin(page)
    await page.fill('#login-email', 'no-es-un-email')
    await page.fill('#login-password', 'cualquier')
    await page.click('#btn-login')
    await page.waitForTimeout(500)
    await expect(page.locator('#login-error')).toBeHidden()
  })
})

// ---------------------------------------------------------------------------
// Bloqueo de cuenta
// ---------------------------------------------------------------------------

test.describe('Bloqueo de cuenta', () => {
  let lockoutUser

  test.beforeEach(async () => {
    const suffix = uniqueSuffix()
    lockoutUser = {
      email: `lockout_${suffix}@test.com`,
      password: 'Test1234!',
    }
    await apiRegister(lockoutUser.email, lockoutUser.password, `Lockout ${suffix}`)
  })

  test('3 intentos fallidos muestran mensaje de bloqueo', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await goToLogin(page)
      await page.fill('#login-email', lockoutUser.email)
      await page.fill('#login-password', 'wrong-password')
      await page.click('#btn-login')
      await expect(page.locator('#login-error')).toBeVisible()
    }

    const texto = await page.locator('#login-error').innerText()
    expect(texto.toLowerCase()).toMatch(/bloqueada|minuto/)
  })

  test('cuenta bloqueada rechaza incluso el password correcto', async ({ page }) => {
    // Provocar bloqueo
    for (let i = 0; i < 3; i++) {
      await goToLogin(page)
      await page.fill('#login-email', lockoutUser.email)
      await page.fill('#login-password', 'wrong-password')
      await page.click('#btn-login')
      await expect(page.locator('#login-error')).toBeVisible()
    }

    // Intentar con credenciales correctas durante el bloqueo
    await goToLogin(page)
    await page.fill('#login-email', lockoutUser.email)
    await page.fill('#login-password', lockoutUser.password)
    await page.click('#btn-login')
    await expect(page.locator('#login-error')).toBeVisible()
    const texto = await page.locator('#login-error').innerText()
    expect(texto.toLowerCase()).toMatch(/bloqueada|minuto/)
  })
})
