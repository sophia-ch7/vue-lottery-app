<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPagination from '@/components/AppPagination.vue'
import SearchBar from '@/components/SearchBar.vue'
import UsersTable from '@/components/UsersTable.vue'
import { ServiceProvider } from '@/services/service-provider'
import type { User } from '@/types/user'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()

const users = ref<User[]>([])
const total = ref(0)
const isLoading = ref(false)
const error = ref<string | null>(null)

const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const search = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

let lastRequestId = 0

async function loadUsers() {
  const requestId = ++lastRequestId
  isLoading.value = true
  error.value = null
  try {
    const result = await ServiceProvider.users.getAll({
      limit: PAGE_SIZE,
      skip: (page.value - 1) * PAGE_SIZE,
      search: search.value,
    })
    if (requestId !== lastRequestId) return
    users.value = result.items
    total.value = result.total
  } catch (e) {
    if (requestId !== lastRequestId) return
    error.value = (e as Error).message
  } finally {
    if (requestId === lastRequestId) isLoading.value = false
  }
}

watch([page, search], loadUsers, { immediate: true })

function changePage(newPage: number) {
  router.push({ query: { ...route.query, page: String(newPage) } })
}

function changeSearch(value: string) {
  const query = { ...route.query }
  delete query.page
  const term = value.trim()
  if (term) query.q = term
  else delete query.q
  router.push({ query })
}
</script>

<template>
  <h1 class="h3 mb-3">Users</h1>

  <div class="card mb-3">
    <div class="card-body">
      <SearchBar :initial-value="search" @filter-by-name="changeSearch" />
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-body">
      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-info" role="status">
          <span class="visually-hidden">Завантаження...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger mb-0" role="alert">{{ error }}</div>
      <UsersTable v-else :users="users" />
    </div>
  </div>

  <AppPagination v-if="!error" :page="page" :total-pages="totalPages" @change="changePage" />
</template>
