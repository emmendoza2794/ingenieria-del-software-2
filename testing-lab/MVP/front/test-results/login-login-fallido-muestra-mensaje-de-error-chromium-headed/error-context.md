# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> login fallido muestra mensaje de error
- Location: tests/e2e/login.spec.js:33:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#btn-login') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - heading "500" [level=1] [ref=e5]
    - heading "Internal Server Error" [level=2] [ref=e6]
    - paragraph [ref=e7]: "Failed to fetch dynamically imported module: http://localhost:3000/_nuxt/pages/login.vue?t=1779509994871"
  - generic:
    - img
  - generic [ref=e8]:
    - button "Toggle Nuxt DevTools" [ref=e9] [cursor=pointer]:
      - img [ref=e10]
    - generic "App load time" [ref=e13]:
      - generic [ref=e14]: "1.6"
      - generic [ref=e15]: s
    - button "Toggle Component Inspector" [ref=e17] [cursor=pointer]:
      - img [ref=e18]
```

# Test source

```ts
  1  | /**
  2  |  * Helpers compartidos para los tests E2E.
  3  |  * Requiere back en :8000 y front en :3000
  4  |  */
  5  | 
  6  | const API_URL = 'http://localhost:8000'
  7  | 
  8  | export async function apiRegister(email, password, name) {
  9  |   const body = new URLSearchParams({ email, password, name })
  10 |   const res = await fetch(`${API_URL}/auth/register`, {
  11 |     method: 'POST',
  12 |     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  13 |     body: body.toString(),
  14 |   })
  15 |   // 201 = creado, 400 = ya existe (ambos son OK para setup)
  16 |   if (res.status !== 201 && res.status !== 400) {
  17 |     const text = await res.text()
  18 |     throw new Error(`apiRegister falló (${res.status}): ${text}`)
  19 |   }
  20 | }
  21 | 
  22 | export function uniqueSuffix() {
  23 |   return Math.random().toString(36).slice(2, 8)
  24 | }
  25 | 
  26 | // Espera a que Vue hidrate: el bundle carga con 'load', pero los handlers
  27 | // @click/@submit se conectan en microtareas posteriores. 1 s es suficiente.
  28 | async function waitForHydration(page) {
  29 |   await page.waitForTimeout(1000)
  30 | }
  31 | 
  32 | export async function goToLogin(page) {
  33 |   await page.goto('/login', { waitUntil: 'load' })
  34 |   await waitForHydration(page)
> 35 |   await page.waitForSelector('#btn-login', { state: 'visible' })
     |              ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  36 | }
  37 | 
  38 | export async function goToRegister(page) {
  39 |   await page.goto('/login', { waitUntil: 'load' })
  40 |   await waitForHydration(page)
  41 |   await page.waitForSelector('#tab-register', { state: 'visible' })
  42 |   await page.click('#tab-register')
  43 |   await page.waitForSelector('#form-register', { state: 'visible' })
  44 | }
  45 | 
```