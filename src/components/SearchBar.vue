<script setup lang="ts">
import { ref, watch } from 'vue'

const DEBOUNCE_MS = 300

const props = withDefaults(defineProps<{ initialValue?: string }>(), { initialValue: '' })
const emit = defineEmits<{ 'filter-by-name': [value: string] }>()

// Початкове значення можна передати ззовні (наприклад, з адреси /users?q=john)
const query = ref(props.initialValue)

// Debounce: чекаємо 300 мс після останнього символу і лише тоді повідомляємо батька
watch(query, (value, _oldValue, onCleanup) => {
  const timer = setTimeout(() => emit('filter-by-name', value), DEBOUNCE_MS)
  // Якщо користувач ввів ще символ раніше, ніж минули 300 мс, старий таймер скасовуємо
  onCleanup(() => clearTimeout(timer))
})
</script>

<template>
  <input
    v-model="query"
    class="form-control"
    type="search"
    placeholder="Search by name"
    aria-label="Пошук за іменем"
  />
</template>
