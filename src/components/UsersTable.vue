<script setup lang="ts">
import type { User } from '@/types/user'

defineProps<{ users: User[] }>()
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="text-muted">{{ user.id }}</td>
          <td class="text-nowrap">{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td class="text-nowrap">{{ user.phone }}</td>
          <td>{{ user.age }}</td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="6" class="text-center text-muted">Користувачів не знайдено</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
