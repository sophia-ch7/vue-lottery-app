<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegistrationBlock from '@/components/RegistrationBlock.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import type { Participant, ParticipantData } from '@/types/participant'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const MAX_WINNERS = 3
const PARTICIPANTS_KEY = 'lottery-participants'
const WINNERS_KEY = 'lottery-winner-ids'

const participants = ref<Participant[]>(loadFromStorage<Participant[]>(PARTICIPANTS_KEY, []))
const winnerIds = ref<number[]>(loadFromStorage<number[]>(WINNERS_KEY, []))

// Збереження в localStorage: watch з опцією deep
watch(participants, (value) => saveToStorage(PARTICIPANTS_KEY, value), { deep: true })
watch(winnerIds, (value) => saveToStorage(WINNERS_KEY, value), { deep: true })

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

// Видалення учасника з підтвердженням
const participantToDelete = ref<Participant | null>(null)

function confirmDelete() {
  const target = participantToDelete.value
  if (!target) return
  participants.value = participants.value.filter((p) => p.id !== target.id)
  // Якщо видалений учасник був переможцем, прибираємо і з блоку переможців
  winnerIds.value = winnerIds.value.filter((id) => id !== target.id)
  participantToDelete.value = null
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
    <ParticipantsTable :participants="participants" @delete="participantToDelete = $event" />

    <BaseModal :show="participantToDelete !== null" @close="participantToDelete = null">
      <template #header>
        <h5 class="modal-title">Видалення учасника</h5>
      </template>

      <p v-if="participantToDelete" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ participantToDelete.name }}", "{{
          participantToDelete.email
        }}"?
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="participantToDelete = null">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
