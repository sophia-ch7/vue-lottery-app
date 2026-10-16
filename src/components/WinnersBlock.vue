<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import WinnerChip from '@/components/WinnerChip.vue'

// Переможцю потрібні лише id та ім'я, тому блок підходить і для учасників лотереї,
// і для користувачів з API
interface Winner {
  id: number
  name: string
}

defineProps<{
  winners: Winner[]
  canPick: boolean
}>()

const emit = defineEmits<{
  pick: []
  remove: [id: number]
}>()
</script>

<template>
  <div class="card mb-3">
    <div class="card-body d-flex gap-3 align-items-start">
      <div class="form-control flex-grow-1 d-flex flex-wrap align-items-center gap-2">
        <WinnerChip
          v-for="winner in winners"
          :key="winner.id"
          :name="winner.name"
          @remove="emit('remove', winner.id)"
        />
        <span v-if="winners.length === 0" class="text-muted">Winners</span>
      </div>
      <BaseButton :disabled="!canPick" @click="emit('pick')">New winner</BaseButton>
    </div>
  </div>
</template>
