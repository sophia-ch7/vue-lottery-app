<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue'
</script>

<template>
  <main class="container py-5">
    <div class="text-center mb-4">
      <AppLogo />
    </div>
    <slot />
  </main>
</template>
