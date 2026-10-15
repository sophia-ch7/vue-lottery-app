import { http } from '@/api/http-client'
import type { CreateUserDto, UpdateUserDto, User, UsersResponse } from '@/types/user'
import type { Creatable, Deletable, Editable, GetAllParams, Page, Readable } from './interfaces'

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll({ limit = 10, skip = 0, search = '' }: GetAllParams = {}): Promise<Page<User>> {
    const query = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    const term = search.trim()
    if (term) query.set('q', term)

    const path = term ? '/users/search' : '/users'
    const data = await http<UsersResponse>(`${path}?${query.toString()}`)
    return { items: data.users, total: data.total }
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }

  async delete(id: number): Promise<void> {
    await http<unknown>(`/users/${id}`, { method: 'DELETE' })
  }
}
