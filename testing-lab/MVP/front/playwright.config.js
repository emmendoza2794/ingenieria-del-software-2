// @ts-check
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3000',
    locale: 'es-CO',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-headed',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: { slowMo: 1500 },
      },
    },
  ],

  // Arranca el servidor de desarrollo antes de los tests si no está corriendo
  // Comenta este bloque si usas ./dev.sh para levantar los servicios manualmente
  // webServer: {
  //   command: 'bun run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  // },
})
