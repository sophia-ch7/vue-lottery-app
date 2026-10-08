<script setup lang="ts">
import { ref } from 'vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegistrationBlock from '@/components/RegistrationBlock.vue'
import type { Participant, ParticipantData } from '@/types/participant'

const participants = ref<Participant[]>([])

function addParticipant(data: ParticipantData) {
  participants.value.push({ id: Date.now(), ...data })
}
</script>

<template>
  <div class="container py-4">
    <RegistrationBlock :participants="participants" @submit="addParticipant" />
    <ParticipantsTable :participants="participants" />
  </div>
</template>
