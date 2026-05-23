export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)

  const setToken = (t: string) => {
    token.value = t
    if (import.meta.client) localStorage.setItem('auth_token', t)
  }

  const logout = () => {
    token.value = null
    if (import.meta.client) localStorage.removeItem('auth_token')
  }

  const restore = () => {
    if (import.meta.client) {
      token.value = localStorage.getItem('auth_token')
    }
  }

  const isAuthenticated = computed(() => !!token.value)

  return { token, setToken, logout, restore, isAuthenticated }
})
