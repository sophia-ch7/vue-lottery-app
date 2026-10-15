<script setup lang="ts">
interface NavItem {
  label: string
  name: string // назва маршруту
}

const items: NavItem[] = [
  { label: 'Home', name: 'home' },
  { label: 'About author', name: 'about' },
  { label: 'Users', name: 'users' },
  { label: 'Login', name: 'login' },
]
</script>

<template>
  <nav class="nav nav-pills" aria-label="Головна навігація">
    <RouterLink
      v-for="item in items"
      :key="item.name"
      :to="{ name: item.name }"
      class="nav-link"
      active-class="active"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
