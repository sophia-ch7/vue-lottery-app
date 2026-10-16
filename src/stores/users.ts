import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CreateUserDto, User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const updatedById = ref<Record<number, User>>({})
  const deletedIds = ref<number[]>([])
  const createdUsers = ref<User[]>([])
  const winners = ref<User[]>([])

  function applyLocalChanges(users: User[]): User[] {
    return users
      .filter((user) => !deletedIds.value.includes(user.id))
      .map((user) => updatedById.value[user.id] ?? user)
  }

  function findCreated(id: number): User | undefined {
    return createdUsers.value.find((user) => user.id === id)
  }

  function isCreated(id: number): boolean {
    return findCreated(id) !== undefined
  }

  function addCreated(data: CreateUserDto, serverId: number): User {
    const id = Math.max(serverId, ...createdUsers.value.map((user) => user.id + 1))
    const user: User = { ...data, id, image: '' }
    createdUsers.value.unshift(user)
    return user
  }

  function addWinner(user: User) {
    if (!winners.value.some((winner) => winner.id === user.id)) winners.value.push(user)
  }

  function removeWinner(id: number) {
    winners.value = winners.value.filter((winner) => winner.id !== id)
  }

  function saveUpdated(user: User) {
    const index = createdUsers.value.findIndex((item) => item.id === user.id)
    if (index !== -1) createdUsers.value[index] = user
    else updatedById.value[user.id] = user

    const winnerIndex = winners.value.findIndex((winner) => winner.id === user.id)
    if (winnerIndex !== -1) winners.value[winnerIndex] = user
  }

  function removeUser(id: number) {
    if (isCreated(id)) {
      createdUsers.value = createdUsers.value.filter((user) => user.id !== id)
    } else if (!deletedIds.value.includes(id)) {
      deletedIds.value.push(id)
    }
    removeWinner(id)
  }

  return {
    createdUsers,
    winners,
    applyLocalChanges,
    findCreated,
    isCreated,
    addCreated,
    addWinner,
    removeWinner,
    saveUpdated,
    removeUser,
  }
})
