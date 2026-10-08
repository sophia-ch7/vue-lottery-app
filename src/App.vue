<script setup lang="ts">
import { computed, ref } from 'vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegistrationBlock from '@/components/RegistrationBlock.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import type { Participant, ParticipantData } from '@/types/participant'

const MAX_WINNERS = 3

const participants = ref<Participant[]>([])
const winnerIds = ref<number[]>([])

// Переможці у порядку, в якому їх обрали
const winners = computed(() =>
  winnerIds.value.flatMap((id) => {
    const participant = participants.value.find((p) => p.id === id)
    return participant ? [participant] : []
  }),
)

// Ті, хто ще не вигравав
const availableParticipants = computed(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canPickWinner = computed(
  () => winnerIds.value.length < MAX_WINNERS && availableParticipants.value.length > 0,
)

function addParticipant(data: ParticipantData) {
  participants.value.push({ id: Date.now(), ...data })
}

function pickWinner() {
  if (!canPickWinner.value) return
  const index = Math.floor(Math.random() * availableParticipants.value.length)
  const winner = availableParticipants.value[index]
  if (winner) winnerIds.value.push(winner.id)
}

function removeWinner(id: number) {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}
</script>

<template>
  <div class="container py-4">
    <WinnersBlock
      :winners="winners"
      :can-pick="canPickWinner"
      @pick="pickWinner"
      @remove="removeWinner"
    />
    <RegistrationBlock :participants="participants" @submit="addParticipant" />
    <ParticipantsTable :participants="participants" />
  </div>
</template>
