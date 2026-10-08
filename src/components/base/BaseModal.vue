<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const dialogRef = ref<HTMLElement | null>(null)

watch(
  () => props.show,
  async (isShown) => {
    if (!isShown) return
    await nextTick()
    dialogRef.value?.focus()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show">
        <div class="modal-backdrop show"></div>
        <div
          ref="dialogRef"
          class="modal d-block"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          @keydown.esc="emit('close')"
          @click.self="emit('close')"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <slot name="header" />
                <button
                  type="button"
                  class="btn-close"
                  aria-label="Закрити"
                  @click="emit('close')"
                ></button>
              </div>
              <div class="modal-body">
                <slot />
              </div>
              <div v-if="$slots.footer" class="modal-footer">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal:focus {
  outline: none;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal-dialog {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-dialog {
    transform: translateY(-30px);
  }
}
</style>
