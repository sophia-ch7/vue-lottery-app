<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    label: string
    type?: string
    placeholder?: string
    error?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: '',
  },
)

const model = defineModel<string>({ required: true })
const id = useId()
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :type="type"
      :placeholder="placeholder"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
