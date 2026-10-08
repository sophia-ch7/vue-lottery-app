export interface Participant {
  id: number
  name: string
  birthDate: string
  email: string
  phone: string
}
export type ParticipantData = Omit<Participant, 'id'>
