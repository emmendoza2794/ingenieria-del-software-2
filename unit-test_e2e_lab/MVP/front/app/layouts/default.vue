<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <AppNavigation />
    <main class="pb-16 lg:pb-0 lg:ml-64">
      <slot />
    </main>
    <Toast position="top-right" />
    <ConfirmDialog />
  </div>
</template>
