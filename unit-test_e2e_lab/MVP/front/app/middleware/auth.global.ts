const PUBLIC_ROUTES = ['/', '/login']

export default defineNuxtRouteMiddleware((to) => {
  // Rutas públicas: siempre accesibles
  if (PUBLIC_ROUTES.includes(to.path)) return

  // En SSR no hay localStorage; el plugin auth.client.ts restaura el token en el cliente
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
