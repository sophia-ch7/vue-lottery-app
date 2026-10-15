<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as yup from 'yup'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Правила валідації: обов'язкові поля, мінімальна довжина пароля
const schema = toTypedSchema(
  yup.object({
    username: yup.string().trim().required('Введіть username'),
    password: yup.string().required('Введіть пароль').min(6, 'Мінімум 6 символів'),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: { username: '', password: '' },
})

const [username] = defineField('username')
const [password] = defineField('password')

const loginError = ref<string | null>(null)

// Повертаємо туди, куди користувач хотів потрапити (лише на внутрішні адреси)
function getRedirectTarget() {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return { name: 'users' }
}

// handleSubmit спершу перевіряє форму і викликає функцію, лише якщо помилок немає
const onSubmit = handleSubmit(async (values) => {
  loginError.value = null
  try {
    await auth.login({ username: values.username, password: values.password })
    await router.push(getRedirectTarget())
  } catch (e) {
    loginError.value = (e as Error).message
  }
})
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card">
        <div class="card-body">
          <h1 class="h4 mb-1">Login</h1>
          <p class="text-muted small">Тестовий вхід: emilys / emilyspass</p>

          <form novalidate @submit.prevent="onSubmit">
            <BaseInput
              v-model="username"
              label="Username"
              placeholder="Enter username"
              :error="errors.username"
            />
            <BaseInput
              v-model="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              :error="errors.password"
            />

            <div v-if="loginError" class="alert alert-danger" role="alert">{{ loginError }}</div>

            <div class="d-flex justify-content-end mt-3">
              <BaseButton type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Loading...' : 'Login' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
