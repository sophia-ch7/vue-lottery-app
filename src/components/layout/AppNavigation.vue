<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface NavItem {
  label: string
  name: string // назва маршруту
}

const items: NavItem[] = [
  { label: 'Home', name: 'home' },
  { label: 'About author', name: 'about' },
  { label: 'Users', name: 'users' },
]

const auth = useAuthStore()
const router = useRouter()

async function onLogout() {
  auth.logout() // очищає токени і localStorage
  await router.push({ name: 'login' })
}
</script>

<template>
  <nav class="nav nav-pills align-items-center" aria-label="Головна навігація">
    <RouterLink
      v-for="item in items"
      :key="item.name"
      :to="{ name: item.name }"
      class="nav-link"
      active-class="active"
    >
      {{ item.label }}
    </RouterLink>

    <span v-if="auth.user" class="text-muted small mx-2">{{ auth.user.firstName }}</span>
    <button v-if="auth.isAuthenticated" type="button" class="nav-link" @click="onLogout">
      Logout
    </button>
    <RouterLink v-else :to="{ name: 'login' }" class="nav-link" active-class="active">
      Login
    </RouterLink>
  </nav>
</template>
