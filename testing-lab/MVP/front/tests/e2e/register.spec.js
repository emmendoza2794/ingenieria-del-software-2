import { test, expect } from '@playwright/test'
import { uniqueSuffix, goToRegister } from './helpers.js'

test('muestra el formulario de registro', async ({ page }) => {
  await goToRegister(page)
  await expect(page.locator('#reg-name')).toBeVisible()
  await expect(page.locator('#reg-email')).toBeVisible()
  await expect(page.locator('#reg-password')).toBeVisible()
  await expect(page.locator('#reg-confirm')).toBeVisible()
  await expect(page.locator('#btn-register')).toBeVisible()
})

test('registro exitoso muestra diálogo de confirmación', async ({ page }) => {
  const suffix = uniqueSuffix()
  await goToRegister(page)
  await page.fill('#reg-name', `Nuevo ${suffix}`)
  await page.fill('#reg-email', `nuevo_${suffix}@test.com`)
  await page.fill('#reg-password', 'Test1234!')
  await page.fill('#reg-confirm', 'Test1234!')
  await page.click('#btn-register')
  await expect(page.getByText('Registro exitoso')).toBeVisible({ timeout: 6000 })
})
