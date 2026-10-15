<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { User } from '@/types/user'

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  isLoading.value = true
  try {
    const page = await ServiceProvider.users.getAll({ limit: 5 })
    users.value = page.items
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <h1 class="h3">Users</h1>
  <p v-if="isLoading">Завантаження...</p>
  <p v-else-if="error" class="text-danger">{{ error }}</p>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.firstName }} {{ user.lastName }}</li>
  </ul>
</template>
