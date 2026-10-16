<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { CreateUserDto, User } from '@/types/user'

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

const schema = toTypedSchema(
  yup.object({
    firstName: yup.string().trim().required('Введіть ім’я'),
    lastName: yup.string().trim().required('Введіть прізвище'),
    email: yup.string().trim().required('Введіть email').email('Некоректний формат email'),
    username: yup.string().trim().required('Введіть username').min(3, 'Мінімум 3 символи'),
    password: yup.string().required('Введіть пароль').min(6, 'Мінімум 6 символів'),
    age: yup
      .string()
      .required('Введіть вік')
      .matches(/^\d+$/, 'Вік має бути цілим числом')
      .test('age-range', 'Вік має бути від 1 до 120', (value) => {
        const age = Number(value)
        return age >= 1 && age <= 120
      }),
    gender: yup.mixed<'male' | 'female'>().oneOf(['male', 'female']).required(),
    phone: yup
      .string()
      .trim()
      .required('Введіть телефон')
      .matches(/^\+?[\d\s\-()]{7,20}$/, 'Некоректний формат телефону'),
  }),
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: props.initial?.firstName ?? '',
    lastName: props.initial?.lastName ?? '',
    email: props.initial?.email ?? '',
    username: props.initial?.username ?? '',
    password: props.initial?.password ?? '',
    age: props.initial ? String(props.initial.age) : '',
    gender: props.initial?.gender ?? 'male',
    phone: props.initial?.phone ?? '',
  },
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [email] = defineField('email')
const [username] = defineField('username')
const [password] = defineField('password')
const [age] = defineField('age')
const [gender] = defineField('gender')
const [phone] = defineField('phone')

const onSubmit = handleSubmit((values) => {
  if (props.isSubmitting) return

  emit('submit', {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    username: values.username.trim(),
    password: values.password,
    age: Number(values.age),
    gender: values.gender,
    phone: values.phone.trim(),
  })
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-md-6">
        <BaseInput
          v-model="firstName"
          label="First name"
          placeholder="Enter first name"
          :error="errors.firstName"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          v-model="lastName"
          label="Last name"
          placeholder="Enter last name"
          :error="errors.lastName"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="Enter email"
          :error="errors.email"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          v-model="username"
          label="Username"
          placeholder="Enter username"
          :error="errors.username"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="Enter password"
          :error="errors.password"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          v-model="phone"
          label="Phone number"
          type="tel"
          placeholder="Enter phone"
          :error="errors.phone"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          v-model="age"
          label="Age"
          type="number"
          placeholder="Enter age"
          :error="errors.age"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label for="user-gender" class="form-label fw-semibold">Gender</label>
        <select id="user-gender" v-model="gender" class="form-select">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div class="d-flex justify-content-end mt-3">
      <BaseButton type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
