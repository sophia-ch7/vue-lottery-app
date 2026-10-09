<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { Participant } from '@/types/participant'

defineProps<{ participants: Participant[] }>()
const emit = defineEmits<{
  edit: [participant: Participant]
  delete: [participant: Participant]
}>()
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col" class="text-muted">#</th>
              <th scope="col">Name</th>
              <th scope="col" class="text-nowrap">Date of Birth</th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in participants" :key="participant.id">
              <td class="text-muted">{{ index + 1 }}</td>
              <td>{{ participant.name }}</td>
              <td class="text-nowrap">{{ participant.birthDate }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td>
                <BaseButton class="btn-sm text-nowrap" @click="emit('edit', participant)">
                  Редагувати дані
                </BaseButton>
              </td>
              <td>
                <BaseButton
                  class="btn-sm text-nowrap"
                  variant="danger"
                  @click="emit('delete', participant)"
                >
                  Видалити учасника
                </BaseButton>
              </td>
            </tr>
            <tr v-if="participants.length === 0">
              <td colspan="7" class="text-center text-muted">Учасників поки немає</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
