<script setup lang="ts">
import { ref, watch } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'

// props: true у маршруті передає параметр :id з адреси як звичайний проп (завжди рядок)
const props = defineProps<{ id: string }>()

const store = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser() {
  const id = Number(props.id)
  isLoading.value = true
  error.value = null
  user.value = null
  try {
    // користувачі, створені локально, на сервері не існують
    const local = store.findCreated(id)
    if (local) {
      user.value = local
      return
    }
    const fetched = await ServiceProvider.users.getById(id)
    // накладаємо локальні зміни (сервер їх не зберігає)
    user.value = store.applyLocalChanges([fetched])[0] ?? null
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
}

watch(() => props.id, loadUser, { immediate: true })
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'users' }" class="d-inline-block mb-3">← До списку</RouterLink>

    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <template v-else-if="user">
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h1 class="h4 mb-0">{{ user.firstName }} {{ user.lastName }}</h1>
            <RouterLink
              :to="{ name: 'user-edit', params: { id } }"
              class="btn btn-info text-white btn-sm"
            >
              Редагувати
            </RouterLink>
          </div>
          <dl class="row mb-0">
            <dt class="col-sm-3">Username</dt>
            <dd class="col-sm-9">{{ user.username }}</dd>
            <dt class="col-sm-3">Email</dt>
            <dd class="col-sm-9">{{ user.email }}</dd>
            <dt class="col-sm-3">Phone number</dt>
            <dd class="col-sm-9">{{ user.phone }}</dd>
            <dt class="col-sm-3">Age</dt>
            <dd class="col-sm-9">{{ user.age }}</dd>
            <dt class="col-sm-3">Gender</dt>
            <dd class="col-sm-9">{{ user.gender }}</dd>
          </dl>
        </div>
      </div>

      <!-- Сюди роутер підставляє вкладений маршрут (форму редагування) -->
      <RouterView v-slot="{ Component }">
        <component :is="Component" :user="user" @saved="user = $event" />
      </RouterView>
    </template>

    <div v-else class="alert alert-warning" role="alert">Користувача не знайдено</div>
  </div>
</template>
