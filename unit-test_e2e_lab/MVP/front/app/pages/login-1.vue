<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
    <!-- Fondo animado -->
    <div class="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700">
      <div class="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
      <div class="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div class="absolute bottom-0 left-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <!-- Iconos flotantes decorativos -->
      <span class="icon-[ic--twotone-lock] absolute top-20 left-10 w-12 h-12 text-white/20 animate-float" />
      <span class="icon-[ic--twotone-person] absolute top-40 right-20 w-10 h-10 text-white/20 animate-float animation-delay-1000" />
      <span class="icon-[ic--twotone-shield] absolute bottom-32 left-1/4 w-8 h-8 text-white/20 animate-float animation-delay-2000" />
      <span class="icon-[ic--twotone-verified-user] absolute bottom-20 right-1/3 w-10 h-10 text-white/20 animate-float animation-delay-3000" />
      <span class="icon-[ic--twotone-key] absolute top-1/4 left-1/3 w-9 h-9 text-white/15 animate-float animation-delay-1500" />
      <span class="icon-[ic--twotone-fingerprint] absolute top-1/3 right-1/4 w-11 h-11 text-white/20 animate-float animation-delay-2500" />
      <span class="icon-[ic--twotone-security] absolute bottom-40 left-16 w-10 h-10 text-white/15 animate-float animation-delay-3500" />
      <span class="icon-[ic--twotone-admin-panel-settings] absolute top-60 right-12 w-8 h-8 text-white/15 animate-float animation-delay-500" />
    </div>

    <!-- Card de login -->
    <Card class="w-full max-w-md shadow-2xl relative z-10 backdrop-blur-sm bg-white/95">
      <template #header>
        <div class="text-center py-6 px-6">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span class="icon-[ic--twotone-rocket-launch] w-9 h-9 text-white" />
            </div>
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            MVP Base
          </h1>
          <p class="text-gray-500 text-sm">Inicia sesión para continuar</p>
        </div>
      </template>

      <template #content>
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="w-full"
              :invalid="!!emailError"
              :disabled="loading"
            />
            <small v-if="emailError" class="text-red-500 text-xs mt-1 block">{{ emailError }}</small>
          </div>

          <!-- Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <Password
              id="password"
              v-model="password"
              placeholder="••••••••"
              class="w-full"
              :invalid="!!passwordError"
              :feedback="false"
              toggleMask
              :disabled="loading"
            />
            <small v-if="passwordError" class="text-red-500 text-xs mt-1 block">{{ passwordError }}</small>
          </div>

          <!-- Olvidé mi contraseña -->
          <div class="flex justify-end">
            <button type="button" class="text-xs text-violet-600 hover:text-indigo-700 font-medium transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Error general -->
          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>

          <!-- Botón enviar -->
          <Button
            type="submit"
            label="Iniciar sesión"
            icon="pi pi-sign-in"
            class="w-full"
            :loading="loading"
            :disabled="loading"
          />
        </form>
      </template>

      <template #footer>
        <div class="text-center text-sm text-gray-500 pb-4">
          <p class="mb-1">MVP Base © {{ new Date().getFullYear() }}</p>
          <p class="text-xs text-gray-400">Tu punto de partida para grandes proyectos</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const errorMessage = ref('')
const loading = ref(false)

const validateForm = () => {
  emailError.value = ''
  passwordError.value = ''
  errorMessage.value = ''
  let valid = true

  if (!email.value) {
    emailError.value = 'El correo es requerido'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Correo inválido'
    valid = false
  }

  if (!password.value) {
    passwordError.value = 'La contraseña es requerida'
    valid = false
  } else if (password.value.length < 6) {
    passwordError.value = 'Mínimo 6 caracteres'
    valid = false
  }

  return valid
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    // TODO: implementar lógica de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000))
    navigateTo('/')
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-blob { animation: blob 7s infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animation-delay-500 { animation-delay: 0.5s; }
.animation-delay-1000 { animation-delay: 1s; }
.animation-delay-1500 { animation-delay: 1.5s; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-2500 { animation-delay: 2.5s; }
.animation-delay-3000 { animation-delay: 3s; }
.animation-delay-3500 { animation-delay: 3.5s; }
.animation-delay-4000 { animation-delay: 4s; }
</style>
