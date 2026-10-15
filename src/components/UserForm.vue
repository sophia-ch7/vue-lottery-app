<script setup lang="ts">
import { computed, reactive } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { CreateUserDto, User } from '@/types/user'

interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: string
  gender: 'male' | 'female'
  phone: string
}

const props = withDefaults(
  defineProps<{
    initial?: User | null
    submitLabel?: string
    isSubmitting?: boolean
    error?: string | null
  }>(),
  {
    initial: null,
    submitLabel: 'Save',
    isSubmitting: false,
    error: null,
  },
)

const emit = defineEmits<{ submit: [data: CreateUserDto] }>()

const form = reactive<UserFormValues>({
  firstName: props.initial?.firstName ?? '',
  lastName: props.initial?.lastName ?? '',
  email: props.initial?.email ?? '',
  username: props.initial?.username ?? '',
  password: props.initial?.password ?? '',
  age: props.initial ? String(props.initial.age) : '',
  gender: props.initial?.gender ?? 'male',
  phone: props.initial?.phone ?? '',
})

const isFilled = computed(() => Object.values(form).every((value) => String(value).trim() !== ''))

function onSubmit() {
  if (!isFilled.value || props.isSubmitting) return

  emit('submit', {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    username: form.username.trim(),
    password: form.password,
    age: Number(form.age),
    gender: form.gender,
    phone: form.phone.trim(),
  })
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-md-6">
        <BaseInput v-model="form.firstName" label="First name" placeholder="Enter first name" />
      </div>
      <div class="col-md-6">
        <BaseInput v-model="form.lastName" label="Last name" placeholder="Enter last name" />
      </div>
      <div class="col-md-6">
        <BaseInput v-model="form.email" label="Email" type="email" placeholder="Enter email" />
      </div>
      <div class="col-md-6">
        <BaseInput v-model="form.username" label="Username" placeholder="Enter username" />
      </div>
      <div class="col-md-6">
        <BaseInput
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="Enter password"
        />
      </div>
      <div class="col-md-6">
        <BaseInput v-model="form.phone" label="Phone number" type="tel" placeholder="Enter phone" />
      </div>
      <div class="col-md-6">
        <BaseInput v-model="form.age" label="Age" type="number" placeholder="Enter age" />
      </div>
      <div class="col-md-6 mb-3">
        <label for="user-gender" class="form-label fw-semibold">Gender</label>
        <select id="user-gender" v-model="form.gender" class="form-select">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div class="d-flex justify-content-end mt-3">
      <BaseButton type="submit" :disabled="!isFilled || isSubmitting">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
