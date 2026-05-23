<template>
  <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
    <div class="container mx-auto px-6 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16 animate-fade-in">
        <div class="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <span class="icon-[ic--twotone-bolt] w-4 h-4"></span>
          Tecnologías Modernas
        </div>
        <h1 class="text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          Dashboard de Componentes
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Explora una colección moderna de componentes construidos con PrimeVue, Tailwind CSS e Iconify
        </p>
      </div>

      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card class="hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Usuarios Activos</p>
                  <p class="text-3xl font-bold text-gray-900">2,543</p>
                  <p class="text-xs text-green-600 mt-2">↑ 12% este mes</p>
                </div>
                <div class="bg-blue-100 p-4 rounded-2xl">
                  <span class="icon-[ic--twotone-group] w-8 h-8 text-blue-600"></span>
                </div>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Ingresos</p>
                  <p class="text-3xl font-bold text-gray-900">$45.2K</p>
                  <p class="text-xs text-green-600 mt-2">↑ 8% este mes</p>
                </div>
                <div class="bg-green-100 p-4 rounded-2xl">
                  <span class="icon-[ic--twotone-attach-money] w-8 h-8 text-green-600"></span>
                </div>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Ventas</p>
                  <p class="text-3xl font-bold text-gray-900">1,423</p>
                  <p class="text-xs text-red-600 mt-2">↓ 3% este mes</p>
                </div>
                <div class="bg-purple-100 p-4 rounded-2xl">
                  <span class="icon-[ic--twotone-shopping-cart] w-8 h-8 text-purple-600"></span>
                </div>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Conversión</p>
                  <p class="text-3xl font-bold text-gray-900">3.2%</p>
                  <p class="text-xs text-green-600 mt-2">↑ 0.5% este mes</p>
                </div>
                <div class="bg-orange-100 p-4 rounded-2xl">
                  <span class="icon-[ic--twotone-trending-up] w-8 h-8 text-orange-600"></span>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Grid de dos columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Formulario Moderno -->
          <Card class="shadow-xl border border-gray-100">
            <template #title>
              <div class="flex items-center gap-3">
                <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <span class="icon-[ic--twotone-edit-note] w-6 h-6 text-white"></span>
                </div>
                <span class="text-xl font-semibold">Formulario de Contacto</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                    <InputText v-model="formData.name" placeholder="Juan" class="w-full" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                    <InputText placeholder="Pérez" class="w-full" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <InputText type="email" placeholder="juan@example.com" class="w-full" />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                  <Select
                    v-model="formData.city"
                    :options="cities"
                    optionLabel="name"
                    placeholder="Selecciona tu ciudad"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
                  <DatePicker v-model="formData.date" placeholder="dd/mm/aaaa" class="w-full" />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                  <Textarea placeholder="Escribe tu mensaje aquí..." rows="4" class="w-full" />
                </div>

                <div class="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <Checkbox v-model="formData.accept" inputId="accept" binary />
                  <label for="accept" class="text-sm text-gray-700">
                    Acepto los términos y condiciones
                  </label>
                </div>

                <div class="flex gap-3">
                  <Button label="Enviar Formulario" icon="pi pi-send" class="flex-1" @click="showToast" />
                  <Button label="Limpiar" severity="secondary" outlined icon="pi pi-refresh" />
                </div>
              </div>
            </template>
          </Card>

          <!-- Panel de Notificaciones -->
          <div class="space-y-6">
            <Card class="shadow-xl border border-gray-100">
              <template #title>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="bg-gradient-to-br from-pink-500 to-rose-600 p-2 rounded-lg">
                      <span class="icon-[ic--twotone-notifications] w-6 h-6 text-white"></span>
                    </div>
                    <span class="text-xl font-semibold">Notificaciones</span>
                  </div>
                  <Badge value="3" severity="danger" />
                </div>
              </template>
              <template #content>
                <div class="space-y-3">
                  <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    <span class="icon-[ic--twotone-mail] w-6 h-6 text-blue-600 mt-1"></span>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-900">Nuevo mensaje recibido</p>
                      <p class="text-sm text-gray-600">Tienes un nuevo mensaje de María García</p>
                      <p class="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                    <span class="icon-[ic--twotone-check-circle] w-6 h-6 text-green-600 mt-1"></span>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-900">Pedido completado</p>
                      <p class="text-sm text-gray-600">Tu pedido #1234 ha sido entregado</p>
                      <p class="text-xs text-gray-500 mt-1">Hace 1 hora</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <span class="icon-[ic--twotone-star] w-6 h-6 text-purple-600 mt-1"></span>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-900">Nueva reseña</p>
                      <p class="text-sm text-gray-600">Alguien dejó una reseña de 5 estrellas</p>
                      <p class="text-xs text-gray-500 mt-1">Hace 3 horas</p>
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Botones de Acción -->
            <Card class="shadow-xl border border-gray-100">
              <template #title>
                <div class="flex items-center gap-3">
                  <div class="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg">
                    <span class="icon-[ic--twotone-touch-app] w-6 h-6 text-white"></span>
                  </div>
                  <span class="text-xl font-semibold">Botones de Acción</span>
                </div>
              </template>
              <template #content>
                <div class="space-y-4">
                  <div class="flex flex-wrap gap-2">
                    <Button label="Primary" severity="primary" size="small" />
                    <Button label="Success" severity="success" size="small" />
                    <Button label="Info" severity="info" size="small" />
                    <Button label="Warn" severity="warn" size="small" />
                    <Button label="Danger" severity="danger" size="small" />
                  </div>
                  <Divider />
                  <div class="flex flex-wrap gap-2">
                    <Button label="Outlined" severity="primary" outlined size="small" />
                    <Button label="Text" severity="primary" text size="small" />
                    <Button icon="pi pi-heart" severity="danger" rounded />
                    <Button icon="pi pi-star" severity="warn" rounded outlined />
                    <Button icon="pi pi-check" severity="success" rounded text />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>

        <!-- DataTable Mejorado -->
        <Card class="shadow-xl border border-gray-100">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                  <span class="icon-[ic--twotone-table-chart] w-6 h-6 text-white"></span>
                </div>
                <span class="text-xl font-semibold">Productos en Inventario</span>
              </div>
              <div class="flex gap-2">
                <Button icon="pi pi-filter" severity="secondary" outlined size="small" />
                <Button icon="pi pi-download" severity="secondary" outlined size="small" />
                <Button label="Nuevo" icon="pi pi-plus" severity="primary" size="small" />
              </div>
            </div>
          </template>
          <template #content>
            <DataTable
              :value="products"
              :paginator="true"
              :rows="5"
              stripedRows
              class="text-sm"
              :rowHover="true"
            >
              <Column field="id" header="ID" sortable style="width: 5rem">
                <template #body="slotProps">
                  <Badge :value="slotProps.data.id" severity="secondary" />
                </template>
              </Column>
              <Column field="name" header="Producto" sortable>
                <template #body="slotProps">
                  <div class="flex items-center gap-3">
                    <span class="icon-[material-symbols--inventory-2] w-5 h-5 text-gray-500"></span>
                    <span class="font-semibold">{{ slotProps.data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="category" header="Categoría" sortable>
                <template #body="slotProps">
                  <Tag :value="slotProps.data.category" :severity="getCategorySeverity(slotProps.data.category)" />
                </template>
              </Column>
              <Column field="price" header="Precio" sortable>
                <template #body="slotProps">
                  <span class="text-lg font-bold text-green-600">
                    ${{ slotProps.data.price.toFixed(2) }}
                  </span>
                </template>
              </Column>
              <Column header="Stock" sortable>
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <ProgressBar
                      :value="slotProps.data.stock || 75"
                      :showValue="false"
                      style="width: 100px; height: 8px"
                    />
                    <span class="text-sm text-gray-600">{{ slotProps.data.stock || 75 }}%</span>
                  </div>
                </template>
              </Column>
              <Column header="Acciones" style="width: 8rem">
                <template #body>
                  <div class="flex gap-2">
                    <Button icon="pi pi-pencil" severity="info" text rounded size="small" />
                    <Button icon="pi pi-trash" severity="danger" text rounded size="small" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>

        <!-- Grid de características -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card class="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <template #content>
              <div class="flex flex-col items-center gap-4">
                <div class="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-2xl">
                  <span class="icon-[ic--twotone-bolt] w-12 h-12 text-white"></span>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Rápido y Eficiente</h3>
                <p class="text-gray-600">
                  Componentes optimizados para un rendimiento excepcional
                </p>
              </div>
            </template>
          </Card>

          <Card class="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <template #content>
              <div class="flex flex-col items-center gap-4">
                <div class="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-2xl">
                  <span class="icon-[ic--twotone-palette] w-12 h-12 text-white"></span>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Totalmente Personalizable</h3>
                <p class="text-gray-600">
                  Adapta cada componente a tu diseño con Tailwind CSS
                </p>
              </div>
            </template>
          </Card>

          <Card class="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <template #content>
              <div class="flex flex-col items-center gap-4">
                <div class="bg-gradient-to-br from-pink-400 to-pink-600 p-6 rounded-2xl">
                  <span class="icon-[ic--twotone-star] w-12 h-12 text-white"></span>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Diseño Moderno</h3>
                <p class="text-gray-600">
                  Interfaz elegante y actual que impresiona a tus usuarios
                </p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const formData = ref({
  name: '',
  city: null,
  date: null,
  accept: false
})

const cities = ref([
  { name: 'Bogotá', code: 'BOG' },
  { name: 'Medellín', code: 'MDE' },
  { name: 'Cali', code: 'CAL' },
  { name: 'Barranquilla', code: 'BAQ' },
  { name: 'Cartagena', code: 'CTG' }
])

const products = ref([
  { id: 1, name: 'Laptop HP', category: 'Electrónica', price: 899.99, stock: 85 },
  { id: 2, name: 'Mouse Logitech', category: 'Accesorios', price: 29.99, stock: 95 },
  { id: 3, name: 'Teclado Mecánico', category: 'Accesorios', price: 79.99, stock: 60 },
  { id: 4, name: 'Monitor Samsung', category: 'Electrónica', price: 249.99, stock: 45 },
  { id: 5, name: 'Webcam HD', category: 'Accesorios', price: 59.99, stock: 70 },
  { id: 6, name: 'Auriculares Sony', category: 'Audio', price: 149.99, stock: 55 },
  { id: 7, name: 'SSD 1TB', category: 'Almacenamiento', price: 119.99, stock: 90 },
])

const getCategorySeverity = (category: string) => {
  const severityMap: Record<string, string> = {
    'Electrónica': 'info',
    'Accesorios': 'success',
    'Audio': 'warn',
    'Almacenamiento': 'secondary'
  }
  return severityMap[category] || 'info'
}

const showToast = () => {
  toast.add({
    severity: 'success',
    summary: '¡Éxito!',
    detail: 'Formulario enviado correctamente',
    life: 3000
  })
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
