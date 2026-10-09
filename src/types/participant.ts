export interface Participant {
  id: number
  name: string
  birthDate: string
  email: string
  phone: string
}
export type ParticipantData = Omit<Participant, 'id'>
export type SortKey = 'name' | 'birthDate'
export type SortDirection = 'asc' | 'desc'
