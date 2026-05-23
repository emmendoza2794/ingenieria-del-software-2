/**
 * SMOKE TEST — Prueba de humo
 *
 * Objetivo: verificar que el sistema responde correctamente con carga mínima.
 * 1 usuario virtual, 30 segundos. Si falla aquí, algo está roto.
 *
 * Ejecutar: k6 run tests/load/smoke.js
 */
import http from 'k6/http'
import { check, sleep } from 'k6'
import { BASE_URL } from './utils.js'

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // < 1 % de errores
    http_req_duration: ['p(95)<500'],   // 95 % de requests < 500 ms
  },
}

// Credenciales del usuario de smoke test
const USER = { email: 'smoke@test.com', password: 'Smoke1234!', name: 'Smoke Test' }

export function setup() {
  // Registrar usuario una sola vez antes del test
  http.post(`${BASE_URL}/auth/register`, USER, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export default function () {
  // 1. Health check
  const health = http.get(`${BASE_URL}/health`)
  check(health, {
    'health: status 200': (r) => r.status === 200,
    'health: estado healthy': (r) => JSON.parse(r.body).status === 'healthy',
  })

  // 2. Login
  const loginRes = http.post(`${BASE_URL}/auth/login`, USER, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  check(loginRes, {
    'login: status 200':      (r) => r.status === 200,
    'login: tiene token':     (r) => JSON.parse(r.body).access_token !== undefined,
    'login: tipo bearer':     (r) => JSON.parse(r.body).token_type === 'bearer',
  })

  // 3. GET /auth/me con el token obtenido
  if (loginRes.status === 200) {
    const token = JSON.parse(loginRes.body).access_token
    const meRes = http.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    check(meRes, {
      'me: status 200':          (r) => r.status === 200,
      'me: email correcto':      (r) => JSON.parse(r.body).email === USER.email,
    })
  }

  sleep(1)
}
