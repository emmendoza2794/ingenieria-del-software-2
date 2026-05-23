<template>
  <div class="min-h-screen flex bg-slate-100">
    <Toast />

    <!-- Panel izquierdo - brand -->
    <div class="hidden lg:flex lg:w-5/12 relative overflow-hidden" style="background: linear-gradient(145deg, #7c3aed 0%, #4f46e5 45%, #1e1b4b 100%)">
      <!-- Iconos flotantes decorativos -->
      <span class="icon-[ic--twotone-rocket-launch] absolute top-20 left-12 w-20 h-20 text-white/10 floating-1" />
      <span class="icon-[ic--twotone-code] absolute top-1/2 -translate-y-1/2 right-16 w-24 h-24 text-white/8 floating-2" />
      <span class="icon-[ic--twotone-terminal] absolute bottom-24 left-16 w-16 h-16 text-white/12 floating-3" />
      <span class="icon-[ic--twotone-api] absolute top-32 right-24 w-14 h-14 text-white/9 floating-1" style="animation-delay: 1s" />
      <span class="icon-[ic--twotone-bolt] absolute bottom-32 right-20 w-18 h-18 text-white/11 floating-2" style="animation-delay: 1.5s" />

      <!-- Contenido centrado -->
      <div class="relative z-10 flex flex-col items-center justify-center h-full w-full px-8 text-center">
        <div class="max-w-md w-full">
          <!-- Logo / Icono -->
          <div class="flex justify-center mb-8">
            <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <span class="icon-[ic--twotone-rocket-launch] w-9 h-9 text-white" />
            </div>
          </div>

          <!-- Carousel slides -->
          <div class="relative overflow-hidden min-h-[160px]">
            <TransitionGroup name="slide">
              <div v-show="currentSlide === 0" key="slide-0" class="absolute inset-0">
                <h1 class="text-3xl font-bold text-white mb-4 leading-tight">
                  Tu proyecto<br />listo para escalar
                </h1>
                <p class="text-white/70 text-base leading-relaxed mx-auto">
                  Una base sólida con autenticación, base de datos y API REST lista para usar desde el primer día.
                </p>
              </div>
              <div v-show="currentSlide === 1" key="slide-1" class="absolute inset-0">
                <h1 class="text-3xl font-bold text-white mb-4 leading-tight">
                  Stack moderno<br />y productivo
                </h1>
                <p class="text-white/70 text-base leading-relaxed mx-auto">
                  FastAPI + Nuxt 4 + PostgreSQL + PrimeVue. Todo configurado y listo para que te enfoques en tu producto.
                </p>
              </div>
              <div v-show="currentSlide === 2" key="slide-2" class="absolute inset-0">
                <h1 class="text-3xl font-bold text-white mb-4 leading-tight">
                  Despliega<br />con confianza
                </h1>
                <p class="text-white/70 text-base leading-relaxed mx-auto">
                  Arquitectura probada con buenas prácticas de seguridad, JWT y manejo de roles incluidos.
                </p>
              </div>
            </TransitionGroup>
          </div>

          <!-- Indicadores carousel -->
          <div class="flex gap-2 mt-12 justify-center">
            <button
              v-for="i in 3"
              :key="i"
              type="button"
              :class="[
                'h-2 rounded-full transition-all duration-300',
                currentSlide === i - 1 ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60',
              ]"
              @click="goToSlide(i - 1)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Panel derecho - formulario -->
    <div class="w-full lg:w-7/12 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">

        <!-- Logo mobile -->
        <div class="lg:hidden flex justify-center mb-6">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span class="icon-[ic--twotone-rocket-launch] w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-800">MVP Base</span>
          </div>
        </div>

        <!-- Card contenedora -->
        <div class="bg-white rounded-2xl shadow-md p-7 lg:p-8">

          <!-- Toggle Login / Registro -->
          <div class="flex bg-gray-100 rounded-xl p-1.5 mb-6">
            <button
              :class="[
                'flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all duration-200',
                !isRegister ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="isRegister = false"
            >
              Inicia sesión
            </button>
            <button
              :class="[
                'flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all duration-200',
                isRegister ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="isRegister = true"
            >
              Regístrate
            </button>
          </div>

          <!-- Formulario Login -->
          <form v-if="!isRegister" class="space-y-4" @submit.prevent="handleLogin">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <div class="relative">
                <span class="icon-[ic--twotone-email] absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none z-10" />
                <InputText
                  v-model="loginEmail"
                  type="email"
                  placeholder="tu@correo.com"
                  :class="[
                    'w-full !pl-10 !bg-gray-50 !border-gray-200 !rounded-lg',
                    loginAttempted && loginErrors.email && 'p-invalid !border-red-400 !bg-red-50/50'
                  ]"
                  :disabled="isLoading"
                  @input="loginErrors.email = ''"
                />
              </div>
              <small v-if="loginAttempted && loginErrors.email" class="text-red-500 text-xs mt-1 block">{{ loginErrors.email }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div class="relative">
                <span class="icon-[ic--twotone-lock] absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none z-10" />
                <InputText
                  v-model="loginPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  :class="[
                    'w-full !pl-10 !pr-10 !bg-gray-50 !border-gray-200 !rounded-lg',
                    loginAttempted && loginErrors.password && 'p-invalid !border-red-400 !bg-red-50/50'
                  ]"
                  :disabled="isLoading"
                  @input="loginErrors.password = ''"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  @click="showPassword = !showPassword"
                >
                  <span :class="[showPassword ? 'icon-[ic--twotone-visibility-off]' : 'icon-[ic--twotone-visibility]', 'w-4.5 h-4.5']" />
                </button>
              </div>
              <small v-if="loginAttempted && loginErrors.password" class="text-red-500 text-xs mt-1 block">{{ loginErrors.password }}</small>
            </div>

            <div class="flex justify-end">
              <button type="button" class="text-xs text-violet-600 hover:text-indigo-700 font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              class="w-full py-3 rounded-lg text-white text-sm font-semibold transition-opacity duration-150 hover:opacity-90 active:opacity-80 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, #7c3aed, #4f46e5)"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Iniciando sesión...</span>
              <span v-else>Iniciar sesión</span>
            </button>
          </form>

          <!-- Formulario Registro -->
          <form v-else class="space-y-4" @submit.prevent="handleRegister">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
              <div class="relative">
                <span class="icon-[ic--twotone-person] absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none z-10" />
                <InputText
                  v-model="regName"
                  placeholder="Juan Pérez"
                  :class="[
                    'w-full !pl-10 !bg-gray-50 !border-gray-200 !rounded-lg',
                    regAttempted && regErrors.name && 'p-invalid !border-red-400 !bg-red-50/50'
                  ]"
                  :disabled="isLoading"
                  @input="regErrors.name = ''"
                />
              </div>
              <small v-if="regAttempted && regErrors.name" class="text-red-500 text-xs mt-1 block">{{ regErrors.name }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <div class="relative">
                <span class="icon-[ic--twotone-email] absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none z-10" />
                <InputText
                  v-model="regEmail"
                  type="email"
                  placeholder="tu@correo.com"
                  :class="[
                    'w-full !pl-10 !bg-gray-50 !border-gray-200 !rounded-lg',
                    regAttempted && regErrors.email && 'p-invalid !border-red-400 !bg-red-50/50'
                  ]"
                  :disabled="isLoading"
                  @input="regErrors.email = ''"
                />
              </div>
              <small v-if="regAttempted && regErrors.email" class="text-red-500 text-xs mt-1 block">{{ regErrors.email }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <Password
                v-model="regPassword"
                placeholder="••••••••"
                :class="[
                  'w-full password-field',
                  regAttempted && regErrors.password && 'password-invalid'
                ]"
                :disabled="isLoading"
                :toggleMask="true"
                :feedback="true"
                promptLabel="Ingresa una contraseña"
                weakLabel="Débil"
                mediumLabel="Media"
                strongLabel="Fuerte"
                inputClass="!pl-10 !pr-10 !bg-gray-50 !border-gray-200 !rounded-lg"
                @input="regErrors.password = ''"
              />
              <small v-if="regAttempted && regErrors.password" class="text-red-500 text-xs mt-1 block">{{ regErrors.password }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirma contraseña</label>
              <div class="relative">
                <span class="icon-[ic--twotone-lock] absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none z-10" />
                <InputText
                  v-model="regConfirm"
                  :type="showRegConfirm ? 'text' : 'password'"
                  placeholder="••••••••"
                  :class="[
                    'w-full !pl-10 !pr-10 !bg-gray-50 !border-gray-200 !rounded-lg',
                    regAttempted && regErrors.confirm && 'p-invalid !border-red-400 !bg-red-50/50'
                  ]"
                  :disabled="isLoading"
                  @input="regErrors.confirm = ''"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  @click="showRegConfirm = !showRegConfirm"
                >
                  <span :class="[showRegConfirm ? 'icon-[ic--twotone-visibility-off]' : 'icon-[ic--twotone-visibility]', 'w-4.5 h-4.5']" />
                </button>
              </div>
              <small v-if="regAttempted && regErrors.confirm" class="text-red-500 text-xs mt-1 block">{{ regErrors.confirm }}</small>
            </div>

            <button
              type="submit"
              class="w-full py-3 rounded-lg text-white text-sm font-semibold transition-opacity duration-150 hover:opacity-90 active:opacity-80 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, #7c3aed, #4f46e5)"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Creando cuenta...</span>
              <span v-else>Crear cuenta</span>
            </button>
          </form>
        </div>

        <!-- Footer legal -->
        <p class="text-center text-xs text-gray-500 mt-6 leading-relaxed">
          MVP Base © {{ new Date().getFullYear() }} — Tu punto de partida para grandes proyectos
        </p>
      </div>
    </div>

    <!-- Modal: Registro exitoso -->
    <Dialog
      v-model:visible="registrationSuccess"
      modal
      :closable="true"
      :showHeader="false"
      :style="{ width: '24rem' }"
      :breakpoints="{ '575px': '90vw' }"
    >
      <div class="flex flex-col items-center text-center pt-6 pb-2 px-2">
        <div class="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <span class="icon-[ic--twotone-check-circle] w-8 h-8 text-emerald-500" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Registro exitoso</h3>
        <p class="text-sm text-gray-500 leading-relaxed">Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.</p>
        <Button
          label="Entendido"
          class="mt-6 w-full"
          @click="registrationSuccess = false; isRegister = false"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: false
})

const toast = useToast()

const isRegister = ref(false)
const isLoading = ref(false)
const registrationSuccess = ref(false)

// Login
const loginEmail = ref('')
const loginPassword = ref('')
const showPassword = ref(false)
const loginAttempted = ref(false)
const loginErrors = ref({ email: '', password: '' })

// Registro
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regConfirm = ref('')
const showRegConfirm = ref(false)
const regAttempted = ref(false)
const regErrors = ref({ name: '', email: '', password: '', confirm: '' })

// Carousel
const currentSlide = ref(0)
let carouselInterval: ReturnType<typeof setInterval> | null = null

const goToSlide = (index: number) => {
  currentSlide.value = index
  if (carouselInterval) clearInterval(carouselInterval)
  startCarousel()
}

const startCarousel = () => {
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % 3
  }, 4000)
}

const validateLogin = () => {
  loginErrors.value = { email: '', password: '' }
  let valid = true
  if (!loginEmail.value) { loginErrors.value.email = 'El correo es requerido'; valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value)) { loginErrors.value.email = 'Correo inválido'; valid = false }
  if (!loginPassword.value) { loginErrors.value.password = 'La contraseña es requerida'; valid = false }
  return valid
}

const validateRegister = () => {
  regErrors.value = { name: '', email: '', password: '', confirm: '' }
  let valid = true
  if (!regName.value || regName.value.trim().length < 2) { regErrors.value.name = 'El nombre debe tener al menos 2 caracteres'; valid = false }
  if (!regEmail.value) { regErrors.value.email = 'El correo es requerido'; valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value)) { regErrors.value.email = 'Correo inválido'; valid = false }
  if (!regPassword.value || regPassword.value.length < 6) { regErrors.value.password = 'Mínimo 6 caracteres'; valid = false }
  if (!regConfirm.value) { regErrors.value.confirm = 'Debes confirmar tu contraseña'; valid = false }
  else if (regPassword.value !== regConfirm.value) { regErrors.value.confirm = 'Las contraseñas no coinciden'; valid = false }
  return valid
}

const handleLogin = async () => {
  loginAttempted.value = true
  if (!validateLogin()) {
    toast.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Corrige los errores en el formulario', life: 3000 })
    return
  }
  isLoading.value = true
  try {
    // TODO: implementar lógica de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({ severity: 'success', summary: 'Inicio de sesión exitoso', detail: 'Bienvenido a MVP Base', life: 2000 })
    navigateTo('/')
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: error.message || 'Credenciales incorrectas', life: 4000 })
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  regAttempted.value = true
  if (!validateRegister()) {
    toast.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Corrige los errores en el formulario', life: 3000 })
    return
  }
  isLoading.value = true
  try {
    // TODO: implementar lógica de registro
    await new Promise(resolve => setTimeout(resolve, 1000))
    registrationSuccess.value = true
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error al registrarse', detail: error.message || 'No se pudo crear la cuenta', life: 4000 })
  } finally {
    isLoading.value = false
  }
}

watch(isRegister, () => {
  loginAttempted.value = false
  regAttempted.value = false
  loginErrors.value = { email: '', password: '' }
  regErrors.value = { name: '', email: '', password: '', confirm: '' }
})

onMounted(() => startCarousel())
onUnmounted(() => { if (carouselInterval) clearInterval(carouselInterval) })
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.6s ease-in-out; }
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to { opacity: 0; transform: translateX(-30px); }
.slide-enter-to, .slide-leave-from { opacity: 1; transform: translateX(0); }

@keyframes floating-1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}
@keyframes floating-2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(-5deg); }
}
@keyframes floating-3 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
}

.floating-1 { animation: floating-1 6s ease-in-out infinite; }
.floating-2 { animation: floating-2 7s ease-in-out infinite; }
.floating-3 { animation: floating-3 5s ease-in-out infinite; }

:deep(.password-field .p-password) { width: 100%; display: block; }
:deep(.password-field .p-password-input) {
  width: 100%;
  padding-left: 2.5rem !important;
  padding-right: 2.5rem !important;
  background-color: rgb(249 250 251) !important;
  border-color: rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
}
:deep(.password-invalid .p-password-input) {
  border-color: #f87171 !important;
  background-color: rgba(254, 226, 226, 0.5) !important;
}
</style>
