<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { User } from '@/types/user'

defineProps<{ users: User[] }>()
const emit = defineEmits<{ delete: [user: User] }>()
</script>

<template>
  <div class="table-responsive">
    <table class="table mb-0 align-middle">
      <thead>
        <tr>
          <th scope="col" class="text-muted">#</th>
          <th scope="col">Name</th>
          <th scope="col">Username</th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col">Age</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="text-muted">{{ user.id }}</td>
          <td class="text-nowrap">
            <RouterLink :to="{ name: 'user-details', params: { id: user.id } }">
              {{ user.firstName }} {{ user.lastName }}
            </RouterLink>
          </td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td class="text-nowrap">{{ user.phone }}</td>
          <td>{{ user.age }}</td>
          <td class="text-nowrap">
            <RouterLink
              :to="{ name: 'user-edit', params: { id: user.id } }"
              class="btn btn-info text-white btn-sm me-2"
            >
              Edit
            </RouterLink>
            <BaseButton class="btn-sm" variant="danger" @click="emit('delete', user)">
              Delete
            </BaseButton>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="7" class="text-center text-muted">Користувачів не знайдено</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
