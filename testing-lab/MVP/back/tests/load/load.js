/**
 * LOAD TEST — Prueba de carga normal
 *
 * Objetivo: medir el comportamiento bajo carga esperada en producción.
 * Simula un tráfico realista con rampa de subida, carga sostenida y bajada.
 *
 * Etapas:
 *   0 →  30s : ramp-up   de 0 a 10 VUs
 *  30 → 120s : sustained  10 VUs (carga nominal)
 * 120 → 150s : ramp-down de 10 a 0 VUs
 *
 * Métricas ISO/IEC 25010 — Eficiencia de desempeño:
 *   - Comportamiento temporal : p(95) de latencia < 800 ms
 *   - Utilización de recursos : tasa de error < 2 %
 *
 * Ejecutar: k6 run tests/load/load.js
 * Con reporte HTML: k6 run tests/load/load.js --out json=results/load.json
 */
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend, Rate, Counter } from 'k6/metrics'
import { BASE_URL } from './utils.js'

// ── Métricas personalizadas ────────────────────────────────────────────────
const loginDuration = new Trend('login_duration', true)
const meDuration    = new Trend('me_duration', true)
const loginErrors   = new Rate('login_errors')
const totalLogins   = new Counter('total_logins')

// ── Configuración ──────────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // ramp-up
    { duration: '90s', target: 10 },   // carga sostenida
    { duration: '30s', target: 0  },   // ramp-down
  ],
  thresholds: {
    http_req_failed:   ['rate<0.02'],   // < 2 % de errores HTTP
    http_req_duration: ['p(95)<800'],   // 95 % de requests < 800 ms
    login_duration:    ['p(95)<600'],   // login específicamente < 600 ms
    login_errors:      ['rate<0.02'],   // < 2 % de logins fallidos
  },
}

const USER = { email: 'load@test.com', password: 'Load1234!', name: 'Load Test' }

export function setup() {
  http.post(`${BASE_URL}/auth/register`, USER, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export default function () {
  // ── Login ────────────────────────────────────────────────────────────────
  const loginRes = http.post(`${BASE_URL}/auth/login`, USER, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  loginDuration.add(loginRes.timings.duration)
  totalLogins.add(1)

  const loginOk = check(loginRes, {
    'login: status 200':  (r) => r.status === 200,
    'login: tiene token': (r) => {
      try { return !!JSON.parse(r.body).access_token } catch { return false }
    },
  })
  loginErrors.add(!loginOk)

  // ── GET /auth/me ─────────────────────────────────────────────────────────
  if (loginRes.status === 200) {
    const token = JSON.parse(loginRes.body).access_token
    const meRes = http.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    meDuration.add(meRes.timings.duration)
    check(meRes, {
      'me: status 200': (r) => r.status === 200,
    })
  }

  // ── Health check ocasional (1 de cada 5 iteraciones) ────────────────────
  if (Math.random() < 0.2) {
    const h = http.get(`${BASE_URL}/health`)
    check(h, { 'health: 200': (r) => r.status === 200 })
  }

  sleep(Math.random() * 2 + 1)   // pausa realista entre 1 y 3 segundos
}
