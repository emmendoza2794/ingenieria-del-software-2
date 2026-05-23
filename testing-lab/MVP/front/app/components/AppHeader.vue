<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Left: Branding -->
        <div class="flex items-center space-x-3">
          <div class="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
            <span class="icon-[ic--twotone-stars] w-7 h-7 text-white"></span>
          </div>
          <div>
            <h1 class="text-sm font-bold text-gray-900">MVP Base</h1>
            <p class="text-xs text-gray-500">Tu template favorito</p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center space-x-3">
          <!-- Notification Bell -->
          <button
            class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Notificaciones"
          >
            <span class="icon-[ic--twotone-notifications] w-5 h-5"></span>
          </button>

          <!-- User Info - Desktop only -->
          <div class="hidden lg:flex items-center space-x-2">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Juan Pérez</p>
              <p class="text-xs text-gray-500">Admin</p>
            </div>
          </div>

          <!-- User Avatar Button -->
          <button
            @click="toggleUserMenu"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold hover:shadow-lg transition-shadow text-sm"
          >
            JP
          </button>
          <Menu ref="userMenu" :model="userMenuItems" :popup="true" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const userMenu = ref()

const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event)
}

const userMenuItems = ref([
  {
    label: 'juan@example.com',
    disabled: true,
    class: 'text-xs text-gray-500'
  },
  { separator: true },
  {
    label: 'Mi Perfil',
    icon: 'pi pi-user',
    command: () => navigateTo('/settings')
  },
  {
    label: 'Configuración',
    icon: 'pi pi-cog',
    command: () => navigateTo('/settings')
  },
  { separator: true },
  {
    label: 'Cerrar Sesión',
    icon: 'pi pi-sign-out',
    command: () => {
      toast.add({ severity: 'warn', summary: 'Sesión', detail: 'Cerrando sesión...', life: 2000 })
    }
  }
])
</script>
