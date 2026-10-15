export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: number
  gender: 'male' | 'female'
  phone: string
  image: string
}

export type CreateUserDto = Omit<User, 'id' | 'image'>

export type UpdateUserDto = Partial<CreateUserDto>

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}
