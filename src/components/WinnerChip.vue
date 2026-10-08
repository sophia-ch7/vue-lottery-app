<script setup lang="ts">
defineProps<{ name: string }>()
const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <span class="badge bg-info d-inline-flex align-items-center gap-2">
    {{ name }}
    <button
      type="button"
      class="btn-close btn-close-white"
      style="font-size: 0.6rem"
      :aria-label="`Видалити переможця ${name}`"
      @click="emit('remove')"
    ></button>
  </span>
</template>
