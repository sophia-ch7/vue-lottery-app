import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CreateUserDto, User } from '@/types/user'

// DummyJSON лише імітує зміни (дані на сервері не змінюються), тому всі наші зміни
// зберігаємо тут і накладаємо поверх даних, які приходять з сервера.
export const useUsersStore = defineStore('users', () => {
  const updatedById = ref<Record<number, User>>({})
  const deletedIds = ref<number[]>([])
  const createdUsers = ref<User[]>([])

  // Серверний список + наші зміни: без видалених, з оновленими даними
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

  // Сервер завжди повертає той самий id для нових, тому унікальний id видаємо самі
  function addCreated(data: CreateUserDto, serverId: number): User {
    const id = Math.max(serverId, ...createdUsers.value.map((user) => user.id + 1))
    const user: User = { ...data, id, image: '' }
    createdUsers.value.unshift(user)
    return user
  }

  function saveUpdated(user: User) {
    const index = createdUsers.value.findIndex((item) => item.id === user.id)
    if (index !== -1) createdUsers.value[index] = user
    else updatedById.value[user.id] = user
  }

  function removeUser(id: number) {
    if (isCreated(id)) {
      createdUsers.value = createdUsers.value.filter((user) => user.id !== id)
    } else if (!deletedIds.value.includes(id)) {
      deletedIds.value.push(id)
    }
  }

  return {
    createdUsers,
    applyLocalChanges,
    findCreated,
    isCreated,
    addCreated,
    saveUpdated,
    removeUser,
  }
})
