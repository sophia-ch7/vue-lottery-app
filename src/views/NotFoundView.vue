<template>
  <div class="text-center py-5">
    <h1 class="display-4">404</h1>
    <p class="text-muted">Такої сторінки не існує.</p>
    <RouterLink :to="{ name: 'home' }">На головну</RouterLink>
  </div>
</template>
