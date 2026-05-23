import { test, expect } from '@playwright/test'
import { apiRegister, uniqueSuffix, goToRegister } from './helpers.js'

/**
 * Tests E2E — flujo de registro
 * Requiere: back en :8000 y front en :3000
 */

let existingUser

test.beforeAll(async () => {
  const suffix = uniqueSuffix()
  existingUser = {
    email: `existing_${suffix}@test.com`,
    password: 'Test1234!',
    name: `Existing ${suffix}`,
  }
  await apiRegister(existingUser.email, existingUser.password, existingUser.name)
})

// ---------------------------------------------------------------------------
// Formulario
// ---------------------------------------------------------------------------

test.describe('Formulario de registro', () => {
  test('el tab registro muestra el formulario', async ({ page }) => {
    await goToRegister(page)
    await expect(page.locator('#reg-name')).toBeVisible()
    await expect(page.locator('#reg-email')).toBeVisible()
    await expect(page.locator('#btn-register')).toBeVisible()
  })

  test('campos vacíos no envían el formulario', async ({ page }) => {
    await goToRegister(page)
    await page.click('#btn-register')
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/login')
  })

  test('passwords que no coinciden no envían el formulario', async ({ page }) => {
    const suffix = uniqueSuffix()
    await goToRegister(page)
    await page.fill('#reg-name', `Test ${suffix}`)
    await page.fill('#reg-email', `pw_${suffix}@test.com`)
    await page.fill('#reg-password', 'Test1234!')
    await page.fill('#reg-confirm', 'OtraPassword!')
    await page.click('#btn-register')
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/login')
  })
})

// ---------------------------------------------------------------------------
// Registro exitoso
// ---------------------------------------------------------------------------

test.describe('Registro exitoso', () => {
  test('muestra diálogo de confirmación', async ({ page }) => {
    const suffix = uniqueSuffix()
    await goToRegister(page)
    await page.fill('#reg-name', `Nuevo ${suffix}`)
    await page.fill('#reg-email', `nuevo_${suffix}@test.com`)
    await page.fill('#reg-password', 'Test1234!')
    await page.fill('#reg-confirm', 'Test1234!')
    await page.click('#btn-register')

    await expect(page.getByText('Registro exitoso')).toBeVisible({ timeout: 6000 })
  })

  test('el botón Entendido cierra el diálogo y vuelve al login', async ({ page }) => {
    const suffix = uniqueSuffix()
    await goToRegister(page)
    await page.fill('#reg-name', `Nuevo ${suffix}`)
    await page.fill('#reg-email', `nuevo2_${suffix}@test.com`)
    await page.fill('#reg-password', 'Test1234!')
    await page.fill('#reg-confirm', 'Test1234!')
    await page.click('#btn-register')

    await expect(page.getByText('Registro exitoso')).toBeVisible({ timeout: 6000 })
    await page.getByRole('button', { name: 'Entendido' }).click()
    await expect(page.locator('#form-login')).toBeVisible({ timeout: 3000 })
  })
})

// ---------------------------------------------------------------------------
// Registro fallido
// ---------------------------------------------------------------------------

test.describe('Registro fallido', () => {
  test('email duplicado muestra error en toast', async ({ page }) => {
    await goToRegister(page)
    await page.fill('#reg-name', 'Usuario Duplicado')
    await page.fill('#reg-email', existingUser.email)
    await page.fill('#reg-password', 'Test1234!')
    await page.fill('#reg-confirm', 'Test1234!')
    await page.click('#btn-register')

    // PrimeVue Toast tiene role="alert"
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 6000 })
  })

  test('password menor a 6 caracteres no pasa validación frontend', async ({ page }) => {
    const suffix = uniqueSuffix()
    await goToRegister(page)
    await page.fill('#reg-name', `Test ${suffix}`)
    await page.fill('#reg-email', `short_${suffix}@test.com`)
    await page.fill('#reg-password', '123')
    await page.fill('#reg-confirm', '123')
    await page.click('#btn-register')
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/login')
  })
})
