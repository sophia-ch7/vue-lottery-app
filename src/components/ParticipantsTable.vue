<script setup lang="ts">
import type { Participant } from '@/types/participant'

defineProps<{ participants: Participant[] }>()
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <table class="table mb-0">
        <thead>
          <tr>
            <th scope="col" class="text-muted">#</th>
            <th scope="col">Name</th>
            <th scope="col">Date of Birth</th>
            <th scope="col">Email</th>
            <th scope="col">Phone number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(participant, index) in participants" :key="participant.id">
            <td class="text-muted">{{ index + 1 }}</td>
            <td>{{ participant.name }}</td>
            <td>{{ participant.birthDate }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phone }}</td>
          </tr>
          <tr v-if="participants.length === 0">
            <td colspan="5" class="text-center text-muted">Учасників поки немає</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
