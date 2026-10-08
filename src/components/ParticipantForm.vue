<script setup lang="ts">
import { computed, reactive } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { Participant, ParticipantData } from '@/types/participant'

const props = defineProps<{ participants: Participant[] }>()
const emit = defineEmits<{ submit: [data: ParticipantData] }>()

type FieldName = keyof ParticipantData

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEXP = /^\+380\d{9}$/
const REQUIRED = 'Це поле обов’язкове'

const createEmptyForm = (): ParticipantData => ({
  name: '',
  birthDate: '',
  email: '',
  phone: '',
})

const form = reactive<ParticipantData>(createEmptyForm())
const touched = reactive<Record<FieldName, boolean>>({
  name: false,
  birthDate: false,
  email: false,
  phone: false,
})

// Сьогоднішня дата у форматі yyyy-mm-dd (локальний час)
const getToday = () => new Date().toLocaleDateString('sv-SE')

const errors = computed<Record<FieldName, string>>(() => {
  const result: Record<FieldName, string> = { name: '', birthDate: '', email: '', phone: '' }

  if (!form.name.trim()) result.name = REQUIRED

  if (!form.birthDate) result.birthDate = REQUIRED
  else if (form.birthDate > getToday())
    result.birthDate = 'Дата народження не може бути в майбутньому'

  const email = form.email.trim().toLowerCase()
  if (!email) result.email = REQUIRED
  else if (!EMAIL_REGEXP.test(email)) result.email = 'Некоректна електронна пошта'
  else if (props.participants.some((p) => p.email.toLowerCase() === email))
    result.email = 'Учасник з такою поштою вже існує'

  if (!form.phone.trim()) result.phone = REQUIRED
  else if (!PHONE_REGEXP.test(form.phone.trim())) result.phone = 'Формат телефону: +380XXXXXXXXX'

  return result
})

const isValid = computed(() => Object.values(errors.value).every((error) => !error))

// Помилку показуємо лише для полів, яких уже торкнулися
const visibleError = (field: FieldName) => (touched[field] ? errors.value[field] : '')

function setAllTouched(value: boolean) {
  for (const field of Object.keys(touched) as FieldName[]) {
    touched[field] = value
  }
}

function resetForm() {
  Object.assign(form, createEmptyForm())
  setAllTouched(false) // без «торкання» валідація мовчить
}

function onSubmit() {
  setAllTouched(true) // тепер показуємо всі помилки
  if (!isValid.value) return

  emit('submit', {
    name: form.name.trim(),
    birthDate: form.birthDate,
    email: form.email.trim(),
    phone: form.phone.trim(),
  })
  resetForm()
}
</script>

<template>
  <form novalidate @keydown.enter.prevent="onSubmit">
    <BaseInput
      v-model="form.name"
      label="Name"
      placeholder="Enter user name"
      :error="visibleError('name')"
      @blur="touched.name = true"
    />
    <BaseInput
      v-model="form.birthDate"
      label="Date of Birth"
      type="date"
      :error="visibleError('birthDate')"
      @blur="touched.birthDate = true"
    />
    <BaseInput
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="visibleError('email')"
      @blur="touched.email = true"
    />
    <BaseInput
      v-model="form.phone"
      label="Phone number"
      type="tel"
      placeholder="+380XXXXXXXXX"
      :error="visibleError('phone')"
      @blur="touched.phone = true"
    />
    <div class="d-flex justify-content-end mt-4">
      <BaseButton @click="onSubmit">Save</BaseButton>
    </div>
  </form>
</template>
