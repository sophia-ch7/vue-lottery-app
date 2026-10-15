<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPagination from '@/components/AppPagination.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import SearchBar from '@/components/SearchBar.vue'
import UserForm from '@/components/UserForm.vue'
import UsersTable from '@/components/UsersTable.vue'
import { ServiceProvider } from '@/services/service-provider'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto, User } from '@/types/user'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()
const store = useUsersStore()

const serverUsers = ref<User[]>([])
const total = ref(0)
const isLoading = ref(false)
const error = ref<string | null>(null)

const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const search = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

const visibleUsers = computed(() => {
  const users = store.applyLocalChanges(serverUsers.value)
  if (page.value !== 1) return users

  const term = search.value.trim().toLowerCase()
  const created = store.createdUsers.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(term),
  )
  return [...created, ...users]
})

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
    serverUsers.value = result.items
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

const isCreateOpen = ref(false)
const isSaving = ref(false)
const createError = ref<string | null>(null)

function openCreate() {
  createError.value = null
  isCreateOpen.value = true
}

async function createUser(data: CreateUserDto) {
  isSaving.value = true
  createError.value = null
  try {
    const response = await ServiceProvider.users.create(data)
    store.addCreated(data, response.id)
    isCreateOpen.value = false
    if (page.value !== 1) await router.push({ query: { ...route.query, page: '1' } })
  } catch (e) {
    createError.value = (e as Error).message
  } finally {
    isSaving.value = false
  }
}

const userToDelete = ref<User | null>(null)
const deleteError = ref<string | null>(null)

function askDelete(user: User) {
  deleteError.value = null
  userToDelete.value = user
}

async function confirmDelete() {
  const target = userToDelete.value
  if (!target) return
  isSaving.value = true
  deleteError.value = null
  try {
    if (!store.isCreated(target.id)) await ServiceProvider.users.delete(target.id)
    store.removeUser(target.id)
    userToDelete.value = null
  } catch (e) {
    deleteError.value = (e as Error).message
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h3 mb-0">Users</h1>
    <BaseButton @click="openCreate">Add user</BaseButton>
  </div>

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
      <UsersTable v-else :users="visibleUsers" @delete="askDelete" />
    </div>
  </div>

  <AppPagination v-if="!error" :page="page" :total-pages="totalPages" @change="changePage" />

  <BaseModal :show="isCreateOpen" @close="isCreateOpen = false">
    <template #header>
      <h5 class="modal-title">Новий користувач</h5>
    </template>
    <UserForm
      v-if="isCreateOpen"
      submit-label="Створити"
      :is-submitting="isSaving"
      :error="createError"
      @submit="createUser"
    />
  </BaseModal>

  <BaseModal :show="userToDelete !== null" @close="userToDelete = null">
    <template #header>
      <h5 class="modal-title">Видалення користувача</h5>
    </template>
    <template v-if="userToDelete">
      <p class="mb-0">
        Ви дійсно бажаєте видалити користувача "{{ userToDelete.firstName }}
        {{ userToDelete.lastName }}", "{{ userToDelete.email }}"?
      </p>
      <div v-if="deleteError" class="alert alert-danger mt-3 mb-0" role="alert">
        {{ deleteError }}
      </div>
    </template>
    <template #footer>
      <BaseButton variant="secondary" @click="userToDelete = null">Ні</BaseButton>
      <BaseButton variant="danger" :disabled="isSaving" @click="confirmDelete">Так</BaseButton>
    </template>
  </BaseModal>
</template>
