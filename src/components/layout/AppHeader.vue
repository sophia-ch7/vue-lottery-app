<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue'
import AppNavigation from '@/components/layout/AppNavigation.vue'
</script>

<template>
  <header class="bg-white border-bottom">
    <div class="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>
