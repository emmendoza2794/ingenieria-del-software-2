<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-16 text-center">
      <div class="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
        <span class="icon-[ic--twotone-menu-book] w-4 h-4"></span>
        Documentación
      </div>
      <h1 class="text-5xl font-extrabold text-white mb-4">MVP Base</h1>
      <p class="text-xl text-white/85 max-w-2xl mx-auto">
        Template full-stack con arquitectura en capas, diseñado para despliegue serverless en AWS Lambda y Cloudflare Workers.
      </p>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-12 space-y-10">

      <!-- Descripción -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span class="icon-[ic--twotone-info] w-6 h-6 text-blue-600"></span>
          ¿Qué incluye?
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="feature in features"
            :key="feature.text"
            class="flex items-center gap-3 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm"
          >
            <span :class="feature.icon + ' w-5 h-5 shrink-0 text-blue-600'"></span>
            <span class="text-sm text-gray-700">{{ feature.text }}</span>
          </div>
        </div>
      </section>

      <!-- Stack Tecnológico -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span class="icon-[ic--twotone-layers] w-6 h-6 text-blue-600"></span>
          Stack Tecnológico
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card v-for="stack in techStacks" :key="stack.title" class="border border-gray-100 shadow-sm">
            <template #title>
              <div class="flex items-center gap-3">
                <div :class="stack.color + ' w-9 h-9 rounded-lg flex items-center justify-center shrink-0'">
                  <span :class="stack.icon + ' w-5 h-5 text-white'"></span>
                </div>
                <span class="text-base font-bold">{{ stack.title }}</span>
              </div>
            </template>
            <template #content>
              <ul class="space-y-2 mt-1">
                <li v-for="item in stack.items" :key="item.name" class="flex items-start gap-2">
                  <span class="icon-[ic--twotone-check-circle] w-4 h-4 text-green-500 mt-0.5 shrink-0"></span>
                  <span class="text-sm text-gray-700">
                    <span class="font-semibold">{{ item.name }}</span>
                    <span class="text-gray-500"> — {{ item.desc }}</span>
                  </span>
                </li>
              </ul>
            </template>
          </Card>
        </div>
      </section>

      <!-- Arquitectura -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span class="icon-[ic--twotone-account-tree] w-6 h-6 text-blue-600"></span>
          Arquitectura
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Backend -->
          <Card class="border border-gray-100 shadow-sm">
            <template #title>
              <div class="flex items-center gap-2">
                <span class="icon-[ic--twotone-dns] w-5 h-5 text-orange-500"></span>
                <span class="text-base font-bold">Backend (FastAPI)</span>
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-2 mt-1">
                <div
                  v-for="layer in backendLayers"
                  :key="layer.name"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg"
                  :class="layer.bg"
                >
                  <span :class="layer.icon + ' w-4 h-4 ' + layer.color"></span>
                  <div>
                    <span class="text-sm font-semibold" :class="layer.color">{{ layer.name }}</span>
                    <span class="text-xs text-gray-500 ml-2">{{ layer.desc }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-center gap-2 text-gray-400 text-xs mt-1">
                  <span class="icon-[ic--twotone-arrow-downward] w-4 h-4"></span>
                  Flujo: Routes → Services → Repositories → Models
                </div>
              </div>
            </template>
          </Card>

          <!-- Frontend -->
          <Card class="border border-gray-100 shadow-sm">
            <template #title>
              <div class="flex items-center gap-2">
                <span class="icon-[ic--twotone-web] w-5 h-5 text-blue-500"></span>
                <span class="text-base font-bold">Frontend (Nuxt 4)</span>
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-2 mt-1">
                <div
                  v-for="layer in frontendLayers"
                  :key="layer.name"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg"
                  :class="layer.bg"
                >
                  <span :class="layer.icon + ' w-4 h-4 ' + layer.color"></span>
                  <div>
                    <span class="text-sm font-semibold" :class="layer.color">{{ layer.name }}</span>
                    <span class="text-xs text-gray-500 ml-2">{{ layer.desc }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-center gap-2 text-gray-400 text-xs mt-1">
                  <span class="icon-[ic--twotone-arrow-downward] w-4 h-4"></span>
                  Flujo: Pages → Composables → Stores (Pinia)
                </div>
              </div>
            </template>
          </Card>
        </div>
      </section>

      <!-- Inicio Rápido -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span class="icon-[ic--twotone-rocket-launch] w-6 h-6 text-blue-600"></span>
          Inicio Rápido
        </h2>
        <div class="space-y-4">
          <div v-for="(step, i) in quickStart" :key="i" class="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
            <div class="flex items-start gap-4">
              <div class="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {{ i + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 mb-2">{{ step.title }}</p>
                <pre class="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">{{ step.code }}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- API Endpoints -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span class="icon-[ic--twotone-api] w-6 h-6 text-blue-600"></span>
          API Endpoints
        </h2>
        <Card class="border border-gray-100 shadow-sm">
          <template #content>
            <div class="space-y-3">
              <div
                v-for="endpoint in apiEndpoints"
                :key="endpoint.path"
                class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span
                  class="text-xs font-bold px-2 py-1 rounded shrink-0 w-14 text-center"
                  :class="endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
                >
                  {{ endpoint.method }}
                </span>
                <code class="text-sm font-mono text-gray-800 shrink-0">{{ endpoint.path }}</code>
                <span class="text-sm text-gray-500">{{ endpoint.desc }}</span>
                <span v-if="endpoint.auth" class="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded shrink-0">
                  JWT
                </span>
              </div>
            </div>
          </template>
        </Card>
      </section>

      <!-- Variables de entorno -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span class="icon-[ic--twotone-settings] w-6 h-6 text-blue-600"></span>
          Variables de Entorno
        </h2>
        <Card class="border border-gray-100 shadow-sm">
          <template #content>
            <pre class="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">{{ envVars }}</pre>
          </template>
        </Card>
      </section>

      <!-- Seguridad & Despliegue -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span class="icon-[ic--twotone-security] w-6 h-6 text-blue-600"></span>
            Seguridad
          </h2>
          <Card class="border border-gray-100 shadow-sm h-full">
            <template #content>
              <ul class="space-y-3">
                <li v-for="item in securityItems" :key="item.text" class="flex items-start gap-3">
                  <span :class="item.ok ? 'icon-[ic--twotone-check-circle] text-green-500' : 'icon-[ic--twotone-warning] text-orange-500'" class="w-5 h-5 shrink-0 mt-0.5"></span>
                  <span class="text-sm text-gray-700">{{ item.text }}</span>
                </li>
              </ul>
            </template>
          </Card>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span class="icon-[ic--twotone-cloud-upload] w-6 h-6 text-blue-600"></span>
            Despliegue
          </h2>
          <Card class="border border-gray-100 shadow-sm h-full">
            <template #content>
              <div class="space-y-4">
                <div v-for="deploy in deployItems" :key="deploy.title">
                  <div class="flex items-center gap-2 mb-2">
                    <span :class="deploy.icon + ' w-5 h-5 ' + deploy.color"></span>
                    <span class="text-sm font-semibold text-gray-800">{{ deploy.title }}</span>
                  </div>
                  <pre class="bg-gray-900 text-green-400 text-xs rounded-lg p-3 overflow-x-auto">{{ deploy.code }}</pre>
                </div>
              </div>
            </template>
          </Card>
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  { icon: 'icon-[ic--twotone-layers]', text: 'Backend con arquitectura en capas (Layered Architecture)' },
  { icon: 'icon-[ic--twotone-web]', text: 'Frontend moderno con Nuxt 4 + PrimeVue' },
  { icon: 'icon-[ic--twotone-lock]', text: 'Autenticación JWT con hash bcrypt' },
  { icon: 'icon-[ic--twotone-storage]', text: 'Base de datos PostgreSQL con SQLAlchemy' },
  { icon: 'icon-[ic--twotone-monitor-heart]', text: 'Health check con verificación de BD' },
  { icon: 'icon-[ic--twotone-palette]', text: 'UI con PrimeVue 4 y Tailwind CSS 4' },
  { icon: 'icon-[ic--twotone-cloud]', text: 'Listo para despliegue serverless (AWS + Cloudflare)' },
  { icon: 'icon-[ic--twotone-code]', text: 'TypeScript en frontend + Pinia + PWA' },
]

const techStacks = [
  {
    title: 'Backend',
    icon: 'icon-[ic--twotone-dns]',
    color: 'bg-orange-500',
    items: [
      { name: 'FastAPI', desc: 'Framework web moderno' },
      { name: 'SQLAlchemy 2.x', desc: 'ORM para PostgreSQL' },
      { name: 'Pydantic 2.x', desc: 'Validación de datos' },
      { name: 'PyJWT + Passlib', desc: 'Autenticación JWT' },
      { name: 'Uvicorn', desc: 'Servidor ASGI' },
      { name: 'Mangum', desc: 'Adaptador AWS Lambda' },
    ]
  },
  {
    title: 'Frontend',
    icon: 'icon-[ic--twotone-web]',
    color: 'bg-blue-500',
    items: [
      { name: 'Nuxt 4', desc: 'Framework Vue.js' },
      { name: 'PrimeVue 4', desc: 'Librería de componentes UI' },
      { name: 'Tailwind CSS 4', desc: 'Estilos utilitarios' },
      { name: 'Pinia', desc: 'Gestión de estado' },
      { name: 'Iconify', desc: 'Librería de iconos' },
      { name: 'TypeScript', desc: 'Tipado estático' },
    ]
  },
  {
    title: 'DevOps',
    icon: 'icon-[ic--twotone-cloud]',
    color: 'bg-purple-500',
    items: [
      { name: 'AWS Lambda', desc: 'Backend serverless' },
      { name: 'AWS SAM', desc: 'Infrastructure as Code' },
      { name: 'Cloudflare Workers', desc: 'Frontend en el edge' },
      { name: 'Wrangler', desc: 'CLI de Cloudflare' },
      { name: 'Poetry', desc: 'Gestión de paquetes Python' },
      { name: 'PostgreSQL 14+', desc: 'Base de datos' },
    ]
  }
]

const backendLayers = [
  { name: 'Routes', desc: 'Manejo de HTTP requests/responses', icon: 'icon-[ic--twotone-route]', color: 'text-blue-700', bg: 'bg-blue-50' },
  { name: 'Services', desc: 'Lógica de negocio', icon: 'icon-[ic--twotone-settings]', color: 'text-purple-700', bg: 'bg-purple-50' },
  { name: 'Repositories', desc: 'Acceso a datos y BD', icon: 'icon-[ic--twotone-storage]', color: 'text-orange-700', bg: 'bg-orange-50' },
  { name: 'Models', desc: 'Entidades SQLAlchemy', icon: 'icon-[ic--twotone-table-chart]', color: 'text-green-700', bg: 'bg-green-50' },
  { name: 'Schemas', desc: 'Validación Pydantic (DTOs)', icon: 'icon-[ic--twotone-checklist]', color: 'text-red-700', bg: 'bg-red-50' },
]

const frontendLayers = [
  { name: 'Pages', desc: 'Vistas y rutas de la app', icon: 'icon-[ic--twotone-web]', color: 'text-blue-700', bg: 'bg-blue-50' },
  { name: 'Layouts', desc: 'Estructura base (nav, header)', icon: 'icon-[ic--twotone-view-quilt]', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  { name: 'Components', desc: 'Componentes reutilizables', icon: 'icon-[ic--twotone-widgets]', color: 'text-purple-700', bg: 'bg-purple-50' },
  { name: 'Composables', desc: 'Lógica reutilizable (hooks)', icon: 'icon-[ic--twotone-integration-instructions]', color: 'text-orange-700', bg: 'bg-orange-50' },
  { name: 'Stores (Pinia)', desc: 'Estado global de la app', icon: 'icon-[ic--twotone-storage]', color: 'text-green-700', bg: 'bg-green-50' },
]

const quickStart = [
  {
    title: 'Clonar y ejecutar el setup',
    code: `git clone <tu-repo-url>
cd mvp-base
./setup-project.sh`
  },
  {
    title: 'Configurar variables de entorno del backend',
    code: `cp back/.env.example back/.env
# Editar back/.env con tus valores:
# DATABASE_URL=postgresql://user:pass@localhost:5432/mvp_base
# JWT_SECRET_KEY=tu-clave-secreta`
  },
  {
    title: 'Instalar dependencias e iniciar el backend',
    code: `cd back
poetry install
poetry run uvicorn src.main:app --reload --port 8000
# API: http://localhost:8000
# Docs: http://localhost:8000/docs`
  },
  {
    title: 'Instalar dependencias e iniciar el frontend',
    code: `cd front
npm install
npm run dev
# App: http://localhost:3000`
  },
]

const apiEndpoints = [
  { method: 'GET', path: '/health', desc: 'Estado del servicio y base de datos', auth: false },
  { method: 'POST', path: '/auth/register', desc: 'Registrar nuevo usuario (Form Data)', auth: false },
  { method: 'POST', path: '/auth/login', desc: 'Iniciar sesión, retorna JWT (Form Data)', auth: false },
  { method: 'GET', path: '/auth/me', desc: 'Obtener usuario autenticado actual', auth: true },
]

const envVars = `# back/.env

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/mvp_base

# Aplicación
DEBUG=True

# JWT
JWT_SECRET_KEY=tu-clave-super-secreta  # ⚠️ Cambiar en producción
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080   # 7 días`

const securityItems = [
  { ok: true, text: 'Autenticación JWT con expiración configurable' },
  { ok: true, text: 'Hash de contraseñas con bcrypt' },
  { ok: true, text: 'Validación de entrada con Pydantic' },
  { ok: true, text: 'Variables de entorno para secrets' },
  { ok: false, text: 'Cambiar JWT_SECRET_KEY en producción' },
]

const deployItems = [
  {
    title: 'Backend — AWS Lambda',
    icon: 'icon-[ic--twotone-cloud-upload]',
    color: 'text-orange-500',
    code: `cd back\nsam build\nsam deploy --guided\n# o: ./deploy.sh`
  },
  {
    title: 'Frontend — Cloudflare Workers',
    icon: 'icon-[ic--twotone-cloud-upload]',
    color: 'text-blue-500',
    code: `cd front\nnpm run deploy`
  },
]
</script>
