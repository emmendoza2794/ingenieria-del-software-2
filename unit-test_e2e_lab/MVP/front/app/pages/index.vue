<template>
  <div class="min-h-screen bg-gray-950 text-white overflow-x-hidden">

    <!-- Navbar fija -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span class="icon-[ic--twotone-stars] w-5 h-5 text-white"></span>
          </div>
          <span class="font-bold text-lg">MVP Base</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="navigateTo('/docs')"
            class="hidden sm:flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            <span class="icon-[ic--twotone-menu-book] w-4 h-4"></span>
            Documentación
          </button>
          <button
            @click="navigateTo('/demo')"
            class="bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Ver Demo →
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative pt-32 pb-24 px-6 text-center overflow-hidden">
      <!-- Fondo decorativo -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div class="absolute top-40 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div class="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      <div class="relative max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          Template Full-Stack listo para producción
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
          Construye tu MVP
          <span class="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            en días, no semanas
          </span>
        </h1>

        <p class="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Template full-stack con FastAPI, Nuxt 4 y PostgreSQL. Arquitectura en capas, autenticación JWT, despliegue serverless listo desde el primer día.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            @click="navigateTo('/demo')"
            class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <span class="icon-[ic--twotone-dashboard] w-5 h-5"></span>
            Ver Demo
          </button>
          <button
            @click="navigateTo('/docs')"
            class="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-white font-semibold px-8 py-4 rounded-xl text-lg hover:-translate-y-0.5"
          >
            <span class="icon-[ic--twotone-menu-book] w-5 h-5"></span>
            Documentación
          </button>
        </div>

        <!-- Badges de tecnologías -->
        <div class="flex flex-wrap justify-center gap-3">
          <span v-for="badge in techBadges" :key="badge.label"
            class="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-white/70"
          >
            <span :class="badge.icon + ' w-4 h-4 ' + badge.color"></span>
            {{ badge.label }}
          </span>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-12 border-y border-white/10 bg-white/[0.02]">
      <div class="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <div class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-1">
            {{ stat.value }}
          </div>
          <div class="text-sm text-white/50">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Stack -->
    <section class="py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Stack tecnológico moderno</h2>
          <p class="text-white/50 max-w-xl mx-auto">Cada tecnología elegida por su madurez, comunidad y compatibilidad con entornos serverless.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="stack in techStacks"
            :key="stack.title"
            class="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group"
          >
            <div class="flex items-center gap-3 mb-5">
              <div :class="stack.gradient + ' w-11 h-11 rounded-xl flex items-center justify-center shrink-0'">
                <span :class="stack.icon + ' w-6 h-6 text-white'"></span>
              </div>
              <div>
                <h3 class="font-bold text-base">{{ stack.title }}</h3>
                <p class="text-xs text-white/40">{{ stack.subtitle }}</p>
              </div>
            </div>
            <ul class="space-y-2.5">
              <li v-for="item in stack.items" :key="item" class="flex items-center gap-2 text-sm text-white/65">
                <span class="icon-[ic--twotone-check] w-4 h-4 text-blue-400 shrink-0"></span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Arquitectura -->
    <section class="py-24 px-6 bg-white/[0.02] border-y border-white/10">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Arquitectura en capas</h2>
          <p class="text-white/50 max-w-xl mx-auto">Backend y frontend con estructura clara, separación de responsabilidades y fácil extensión.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Backend layers -->
          <div class="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-6">
              <span class="icon-[ic--twotone-dns] w-6 h-6 text-orange-400"></span>
              <h3 class="font-bold text-lg">Backend — FastAPI</h3>
            </div>
            <div class="space-y-2">
              <div
                v-for="(layer, i) in backendLayers"
                :key="layer.name"
                class="flex items-center gap-4 p-3 rounded-xl border transition-colors"
                :class="layer.style"
              >
                <span :class="layer.icon + ' w-5 h-5 shrink-0'"></span>
                <div class="min-w-0">
                  <span class="text-sm font-semibold block">{{ layer.name }}</span>
                  <span class="text-xs opacity-70">{{ layer.desc }}</span>
                </div>
                <span v-if="i < backendLayers.length - 1" class="ml-auto text-white/20 text-xs">↓</span>
              </div>
            </div>
          </div>

          <!-- Frontend layers -->
          <div class="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-6">
              <span class="icon-[ic--twotone-web] w-6 h-6 text-blue-400"></span>
              <h3 class="font-bold text-lg">Frontend — Nuxt 4</h3>
            </div>
            <div class="space-y-2">
              <div
                v-for="(layer, i) in frontendLayers"
                :key="layer.name"
                class="flex items-center gap-4 p-3 rounded-xl border transition-colors"
                :class="layer.style"
              >
                <span :class="layer.icon + ' w-5 h-5 shrink-0'"></span>
                <div class="min-w-0">
                  <span class="text-sm font-semibold block">{{ layer.name }}</span>
                  <span class="text-xs opacity-70">{{ layer.desc }}</span>
                </div>
                <span v-if="i < frontendLayers.length - 1" class="ml-auto text-white/20 text-xs">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features destacadas -->
    <section class="py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Todo lo que necesitas incluido</h2>
          <p class="text-white/50 max-w-xl mx-auto">Sin configuración extra. Empieza a construir tu producto desde el primer commit.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
          >
            <div :class="feature.iconBg + ' w-11 h-11 rounded-xl flex items-center justify-center mb-4'">
              <span :class="feature.icon + ' w-6 h-6 text-white'"></span>
            </div>
            <h3 class="font-bold mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-white/50 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="py-24 px-6 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-blue-600/15 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-2xl mx-auto text-center">
        <h2 class="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
          Listo para empezar<span class="text-blue-400">?</span>
        </h2>
        <p class="text-white/50 mb-10 text-lg">Explora el demo de componentes o revisa la documentación técnica del template.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="navigateTo('/demo')"
            class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-blue-600/30 hover:-translate-y-0.5"
          >
            <span class="icon-[ic--twotone-dashboard] w-5 h-5"></span>
            Ver Demo
          </button>
          <button
            @click="navigateTo('/docs')"
            class="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-white font-semibold px-8 py-4 rounded-xl text-lg hover:-translate-y-0.5"
          >
            <span class="icon-[ic--twotone-menu-book] w-5 h-5"></span>
            Documentación
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-8 px-6 text-center text-sm text-white/30">
      MVP Base · Template Full-Stack · ISC License
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const techBadges = [
  { label: 'FastAPI', icon: 'icon-[ic--twotone-bolt]', color: 'text-orange-400' },
  { label: 'Nuxt 4', icon: 'icon-[ic--twotone-web]', color: 'text-green-400' },
  { label: 'PostgreSQL', icon: 'icon-[ic--twotone-storage]', color: 'text-blue-400' },
  { label: 'PrimeVue 4', icon: 'icon-[ic--twotone-palette]', color: 'text-purple-400' },
  { label: 'Tailwind CSS 4', icon: 'icon-[ic--twotone-brush]', color: 'text-cyan-400' },
  { label: 'AWS Lambda', icon: 'icon-[ic--twotone-cloud]', color: 'text-yellow-400' },
  { label: 'Cloudflare', icon: 'icon-[ic--twotone-cloud-upload]', color: 'text-orange-300' },
  { label: 'TypeScript', icon: 'icon-[ic--twotone-code]', color: 'text-blue-300' },
]

const stats = [
  { value: '2', label: 'Comandos para iniciar' },
  { value: '0', label: 'Config extra necesaria' },
  { value: '100%', label: 'Serverless ready' },
  { value: '∞', label: 'Posibilidades' },
]

const techStacks = [
  {
    title: 'Backend',
    subtitle: 'Python · FastAPI · PostgreSQL',
    icon: 'icon-[ic--twotone-dns]',
    gradient: 'bg-gradient-to-br from-orange-500 to-red-600',
    items: ['FastAPI + Uvicorn + Mangum', 'SQLAlchemy 2.x ORM', 'Pydantic 2.x validación', 'JWT + bcrypt auth', 'Poetry para dependencias']
  },
  {
    title: 'Frontend',
    subtitle: 'Vue 3 · Nuxt 4 · TypeScript',
    icon: 'icon-[ic--twotone-web]',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    items: ['Nuxt 4 + Vue 3 Composition API', 'PrimeVue 4 UI components', 'Tailwind CSS 4 utility-first', 'Pinia state management', 'PWA support incluido']
  },
  {
    title: 'DevOps',
    subtitle: 'AWS · Cloudflare · Serverless',
    icon: 'icon-[ic--twotone-cloud]',
    gradient: 'bg-gradient-to-br from-purple-500 to-violet-600',
    items: ['AWS Lambda + SAM', 'Cloudflare Workers (edge)', 'Deploy con un comando', 'Variables de entorno seguras', 'Health check endpoint']
  },
]

const backendLayers = [
  { name: 'Routes', desc: 'HTTP requests / responses', icon: 'icon-[ic--twotone-route]', style: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
  { name: 'Services', desc: 'Lógica de negocio', icon: 'icon-[ic--twotone-settings]', style: 'bg-purple-500/10 border-purple-500/30 text-purple-300' },
  { name: 'Repositories', desc: 'Acceso a datos', icon: 'icon-[ic--twotone-storage]', style: 'bg-orange-500/10 border-orange-500/30 text-orange-300' },
  { name: 'Models', desc: 'Entidades SQLAlchemy', icon: 'icon-[ic--twotone-table-chart]', style: 'bg-green-500/10 border-green-500/30 text-green-300' },
  { name: 'Schemas', desc: 'Pydantic DTOs', icon: 'icon-[ic--twotone-checklist]', style: 'bg-red-500/10 border-red-500/30 text-red-300' },
]

const frontendLayers = [
  { name: 'Pages', desc: 'Vistas y rutas', icon: 'icon-[ic--twotone-web]', style: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
  { name: 'Layouts', desc: 'Estructura base (nav, header)', icon: 'icon-[ic--twotone-view-quilt]', style: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' },
  { name: 'Components', desc: 'Componentes reutilizables', icon: 'icon-[ic--twotone-widgets]', style: 'bg-purple-500/10 border-purple-500/30 text-purple-300' },
  { name: 'Composables', desc: 'Lógica compartida', icon: 'icon-[ic--twotone-integration-instructions]', style: 'bg-orange-500/10 border-orange-500/30 text-orange-300' },
  { name: 'Stores (Pinia)', desc: 'Estado global reactivo', icon: 'icon-[ic--twotone-storage]', style: 'bg-green-500/10 border-green-500/30 text-green-300' },
]

const features = [
  {
    title: 'Autenticación JWT',
    desc: 'Login, registro y protección de rutas con tokens JWT y hash bcrypt desde el primer día.',
    icon: 'icon-[ic--twotone-lock]',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    title: 'UI Components listos',
    desc: 'PrimeVue 4 con más de 90 componentes: tablas, formularios, modales, toasts y más.',
    icon: 'icon-[ic--twotone-widgets]',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-700'
  },
  {
    title: 'Base de datos + ORM',
    desc: 'PostgreSQL con SQLAlchemy 2.x y arquitectura de repositorios para mantener el código limpio.',
    icon: 'icon-[ic--twotone-storage]',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-700'
  },
  {
    title: 'Serverless listo',
    desc: 'Backend en AWS Lambda con Mangum. Frontend en Cloudflare Workers. Deploy en minutos.',
    icon: 'icon-[ic--twotone-cloud]',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-700'
  },
  {
    title: 'Estado global con Pinia',
    desc: 'Gestión de estado reactiva, simple y con soporte TypeScript para toda la app.',
    icon: 'icon-[ic--twotone-storage]',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-700'
  },
  {
    title: 'PWA incluido',
    desc: 'Progressive Web App preconfigurado. Tu app funciona offline y se puede instalar.',
    icon: 'icon-[ic--twotone-install-mobile]',
    iconBg: 'bg-gradient-to-br from-pink-500 to-pink-700'
  },
  {
    title: 'Health Check',
    desc: 'Endpoint /health con verificación de conexión a base de datos. Monitoreo desde el inicio.',
    icon: 'icon-[ic--twotone-monitor-heart]',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-700'
  },
  {
    title: 'Setup automático',
    desc: 'Script setup-project.sh que configura nombre, autor y variables del proyecto en segundos.',
    icon: 'icon-[ic--twotone-terminal]',
    iconBg: 'bg-gradient-to-br from-gray-500 to-gray-700'
  },
  {
    title: 'TypeScript completo',
    desc: 'Tipado en todo el frontend con inferencia automática en composables, stores y componentes.',
    icon: 'icon-[ic--twotone-code]',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-700'
  },
]
</script>
