<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { ServiceProvider } from '@/services/service-provider'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto, User } from '@/types/user'

const props = defineProps<{
  id: string // з адреси (props: true)
  user: User // передає батьківський компонент
}>()

const emit = defineEmits<{ saved: [user: User] }>()

const router = useRouter()
const store = useUsersStore()

const isSubmitting = ref(false)
const error = ref<string | null>(null)

async function onSubmit(data: CreateUserDto) {
  isSubmitting.value = true
  error.value = null
  try {
    // користувачі, створені локально, на сервері не існують
    if (!store.isCreated(props.user.id)) await ServiceProvider.users.update(props.user.id, data)
    // Сервер зміни не зберігає, тому оновлюємо локальний стан самі
    const saved: User = { ...props.user, ...data }
    store.saveUpdated(saved)
    emit('saved', saved)
    await router.push({ name: 'user-details', params: { id: props.id } })
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h2 class="h5 mb-3">Редагування користувача</h2>
      <UserForm
        :initial="user"
        submit-label="Оновити дані"
        :is-submitting="isSubmitting"
        :error="error"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>
