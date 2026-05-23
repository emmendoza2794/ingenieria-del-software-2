<template>
  <!-- Mobile Bottom Navigation -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40">
    <div class="flex py-2">
      <NuxtLink
        v-for="item in mobileNavItems"
        :key="item.to"
        :to="item.to"
        class="flex-1 flex flex-col items-center py-3 px-2 transition-colors text-gray-500"
        :class="{ 'text-blue-600': $route.path === item.to }"
      >
        <div class="w-8 h-8 mb-1 flex items-center justify-center">
          <span :class="item.icon + ' w-6 h-6'"></span>
        </div>
        <span class="text-xs font-medium">{{ item.shortLabel || item.label }}</span>
      </NuxtLink>

      <!-- Menu Button -->
      <button
        @click="menuDrawerOpen = true"
        class="flex-1 flex flex-col items-center py-3 px-2 transition-colors text-gray-500"
      >
        <div class="w-8 h-8 mb-1 flex items-center justify-center">
          <span class="icon-[ic--twotone-menu] w-6 h-6"></span>
        </div>
        <span class="text-xs font-medium">Menú</span>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Drawer -->
  <Drawer v-model:visible="menuDrawerOpen" position="right" class="!w-[80%] sm:!w-80 lg:hidden">
    <template #header>
      <div class="flex items-center space-x-2">
        <span class="icon-[ic--twotone-menu] w-6 h-6 text-blue-600"></span>
        <h2 class="text-xl font-semibold text-gray-900">Menú</h2>
      </div>
    </template>

    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto space-y-6 pb-4">
        <!-- Principal Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Principal</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in mainNavItems"
              :key="item.to"
              :to="item.to"
              @click="menuDrawerOpen = false"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Utilidades Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Utilidades</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in utilitiesItems"
              :key="item.label"
              :to="item.to"
              @click="menuDrawerOpen = false"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Ejemplos Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Ejemplos</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in exampleItems"
              :key="item.label"
              :to="item.to"
              @click="menuDrawerOpen = false"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Configuración Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Configuración</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in configItems"
              :key="item.label"
              :to="item.to"
              @click="menuDrawerOpen = false"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Drawer>

  <!-- Desktop Sidebar Navigation -->
  <aside class="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 z-30">
    <!-- Logo Section -->
    <div class="flex items-center space-x-3 p-4 border-b border-gray-200">
      <div class="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
        <span class="icon-[ic--twotone-stars] w-7 h-7 text-white"></span>
      </div>
      <div>
        <h1 class="text-lg font-bold text-gray-900">MVP Base</h1>
        <p class="text-xs text-gray-500">Tu template favorito</p>
      </div>
    </div>

    <nav class="flex flex-col flex-1 overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- Principal Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Principal</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in mainNavItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Utilidades Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Utilidades</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in utilitiesItems"
              :key="item.label"
              :to="item.to"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Ejemplos Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Ejemplos</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in exampleItems"
              :key="item.label"
              :to="item.to"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Configuración Section -->
        <div>
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Configuración</h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in configItems"
              :key="item.label"
              :to="item.to"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': $route.path === item.to,
                'text-gray-700 hover:text-blue-600': $route.path !== item.to
              }"
            >
              <span :class="item.icon + ' w-5 h-5'"></span>
              <span class="text-sm">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const menuDrawerOpen = ref(false)

const mobileNavItems = [
  { to: '/', label: 'Inicio', icon: 'icon-[ic--twotone-home]' },
  { to: '/demo', label: 'Demo', icon: 'icon-[ic--twotone-dashboard]' },
  { to: '/docs', label: 'Docs', icon: 'icon-[ic--twotone-menu-book]' },
  { to: '#', label: 'Usuarios', icon: 'icon-[ic--twotone-group]' },
]

const mainNavItems = [
  { to: '/', label: 'Inicio', icon: 'icon-[ic--twotone-home]' },
  { to: '/demo', label: 'Dashboard Demo', icon: 'icon-[ic--twotone-dashboard]' },
  { to: '/docs', label: 'Documentación', icon: 'icon-[ic--twotone-menu-book]' },
  { to: '#', label: 'Usuarios', icon: 'icon-[ic--twotone-group]' },
  { to: '#', label: 'Reportes', icon: 'icon-[ic--twotone-bar-chart]' },
  { to: '#', label: 'Productos', icon: 'icon-[ic--twotone-inventory-2]' },
]

const utilitiesItems = [
  { to: '#', label: 'Facturación', icon: 'icon-[ic--twotone-receipt-long]' },
  { to: '#', label: 'Pagos', icon: 'icon-[ic--twotone-payments]' },
  { to: '#', label: 'Analytics', icon: 'icon-[ic--twotone-trending-up]' },
]

const exampleItems = [
  { to: '/login-1', label: 'Login 1 (Card)', icon: 'icon-[ic--twotone-login]' },
  { to: '/login-2', label: 'Login 2 (Split)', icon: 'icon-[ic--twotone-login]' },
]

const configItems = [
  { to: '#', label: 'Mi Perfil', icon: 'icon-[ic--twotone-person]' },
  { to: '/settings', label: 'Configuraciones', icon: 'icon-[ic--twotone-settings]' },
]
</script>
