<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav aria-label="Пагінація">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <button
          type="button"
          class="page-link"
          :disabled="page <= 1"
          @click="emit('change', page - 1)"
        >
          Назад
        </button>
      </li>
      <li class="page-item disabled">
        <span class="page-link">Сторінка {{ page }} з {{ totalPages }}</span>
      </li>
      <li class="page-item" :class="{ disabled: page >= totalPages }">
        <button
          type="button"
          class="page-link"
          :disabled="page >= totalPages"
          @click="emit('change', page + 1)"
        >
          Далі
        </button>
      </li>
    </ul>
  </nav>
</template>
