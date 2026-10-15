export interface Page<T> {
  items: T[]
  total: number
}

export interface GetAllParams {
  limit?: number
  skip?: number
  search?: string
}

export interface Readable<T> {
  getAll(params?: GetAllParams): Promise<Page<T>>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}
