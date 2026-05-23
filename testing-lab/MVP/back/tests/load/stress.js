/**
 * STRESS TEST — Prueba de estrés
 *
 * Objetivo: encontrar el punto de quiebre del sistema aumentando
 * la carga progresivamente hasta detectar degradación o errores.
 *
 * Etapas:
 *    0 →  30s :  5 VUs   (línea base)
 *   30 →  60s : 15 VUs   (carga media)
 *   60 →  90s : 30 VUs   (carga alta)
 *   90 → 120s : 50 VUs   (estrés)
 *  120 → 150s : 70 VUs   (sobrecarga)
 *  150 → 180s :  0 VUs   (recuperación)
 *
 * Lo que buscamos observar:
 *   - A partir de cuántos VUs la latencia supera 1 s
 *   - Si el sistema se recupera al bajar la carga
 *   - Comportamiento del rate limiter de registro bajo presión
 *
 * Ejecutar: k6 run tests/load/stress.js
 */
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend, Rate } from 'k6/metrics'
import { BASE_URL } from './utils.js'

const loginDuration  = new Trend('login_duration', true)
const loginErrorRate = new Rate('login_error_rate')

export const options = {
  stages: [
    { duration: '30s', target: 5  },
    { duration: '30s', target: 15 },
    { duration: '30s', target: 30 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 70 },
    { duration: '30s', target: 0  },
  ],
  thresholds: {
    // En estrés permitimos umbrales más holgados
    http_req_failed:   ['rate<0.10'],   // < 10 % de errores HTTP
    http_req_duration: ['p(95)<2000'],  // 95 % < 2 s
    login_error_rate:  ['rate<0.10'],
  },
}

const USER = { email: 'stress@test.com', password: 'Stress1234!', name: 'Stress Test' }

export function setup() {
  http.post(`${BASE_URL}/auth/register`, USER, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, USER, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  loginDuration.add(loginRes.timings.duration)

  const ok = check(loginRes, {
    'login: status 200': (r) => r.status === 200,
  })
  loginErrorRate.add(!ok)

  if (loginRes.status === 200) {
    const token = JSON.parse(loginRes.body).access_token
    const meRes = http.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    check(meRes, { 'me: status 200': (r) => r.status === 200 })
  }

  sleep(0.5)
}
