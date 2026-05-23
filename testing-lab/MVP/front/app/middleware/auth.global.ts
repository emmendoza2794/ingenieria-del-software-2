const PUBLIC_ROUTES = ['/', '/login']

export default defineNuxtRouteMiddleware((to) => {
  // En SSR no hay localStorage; el plugin auth.client.ts restaura el token en el cliente
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Si está autenticado y va a /login, redirigir al dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo('/demo')
  }

  // Rutas públicas: siempre accesibles
  if (PUBLIC_ROUTES.includes(to.path)) return

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
