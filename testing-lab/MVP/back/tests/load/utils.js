/**
 * Utilidades compartidas para los tests de carga.
 * Requiere: back corriendo en http://localhost:8000
 */

export const BASE_URL = 'http://localhost:8000'

/**
 * Registra un usuario y retorna sus credenciales.
 * Ignora el error 400 si el email ya existe (idempotente).
 */
export function setupUser(email, password, name) {
  const res = http.post(
    `${BASE_URL}/auth/register`,
    { email, password, name },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )
  // 201 = creado, 400 = ya existe — ambos son OK para setup
  if (res.status !== 201 && res.status !== 400) {
    console.error(`setupUser falló: ${res.status} ${res.body}`)
  }
  return { email, password }
}

/**
 * Hace login y retorna el token de acceso (o null si falla).
 */
export function getToken(email, password) {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    { email, password },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )
  if (res.status === 200) {
    return JSON.parse(res.body).access_token
  }
  return null
}

/** Cabeceras de autenticación Bearer */
export function authHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } }
}
