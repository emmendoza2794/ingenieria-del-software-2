import { test, expect } from '@playwright/test'
import { apiRegister, uniqueSuffix, goToLogin } from './helpers.js'

let testUser

test.beforeAll(async () => {
  const suffix = uniqueSuffix()
  testUser = {
    email: `e2e_${suffix}@test.com`,
    password: 'Test1234!',
    name: `E2E User ${suffix}`,
  }
  await apiRegister(testUser.email, testUser.password, testUser.name)
})

test('muestra el formulario de login', async ({ page }) => {
  await goToLogin(page)
  await expect(page.locator('#form-login')).toBeVisible()
  await expect(page.locator('#login-email')).toBeVisible()
  await expect(page.locator('#login-password')).toBeVisible()
  await expect(page.locator('#btn-login')).toBeVisible()
})

test('login exitoso redirige a /demo', async ({ page }) => {
  await goToLogin(page)
  await page.fill('#login-email', testUser.email)
  await page.fill('#login-password', testUser.password)
  await page.click('#btn-login')
  await page.waitForURL('http://localhost:3000/demo', { timeout: 8000 })
  expect(page.url()).toBe('http://localhost:3000/demo')
})

test('login fallido muestra mensaje de error', async ({ page }) => {
  await goToLogin(page)
  await page.fill('#login-email', testUser.email)
  await page.fill('#login-password', 'password-incorrecta')
  await page.click('#btn-login')
  await expect(page.locator('#login-error')).toBeVisible()
})
