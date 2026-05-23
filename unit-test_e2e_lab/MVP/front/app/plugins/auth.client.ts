// El sufijo .client.ts indica que este plugin corre solo en el navegador.
// Restaura el token desde localStorage antes de que el router evalúe las rutas.
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.restore()
})
