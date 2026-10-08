<script setup lang="ts">
import ParticipantForm from '@/components/ParticipantForm.vue'
import type { Participant, ParticipantData } from '@/types/participant'

defineProps<{ participants: Participant[] }>()
const emit = defineEmits<{ submit: [data: ParticipantData] }>()
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <h6 class="text-uppercase fw-bold mb-0">Register form</h6>
      <p class="text-muted small">Please fill in all the fields.</p>
      <ParticipantForm :participants="participants" @submit="emit('submit', $event)" />
    </div>
  </div>
</template>
