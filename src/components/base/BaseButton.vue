<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'info' | 'danger' | 'secondary'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'info',
    disabled: false,
  },
)
</script>

<template>
  <button
    :class="['btn', `btn-${variant}`, { 'text-white': variant === 'info' }]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
