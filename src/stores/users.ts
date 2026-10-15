import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const updatedById = ref<Record<number, User>>({})

  function applyLocalChanges(users: User[]): User[] {
    return users.map((user) => updatedById.value[user.id] ?? user)
  }

  function saveUpdated(user: User) {
    updatedById.value[user.id] = user
  }

  return { applyLocalChanges, saveUpdated }
})
