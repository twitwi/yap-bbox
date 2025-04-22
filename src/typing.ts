

export type Log = {
  activity: string
  comment: string
  start: number // timestamp in ms
  end: number[] // timestamps in ms (array in case it is stopped on several devices, to track that)
}

export type Activity = {
  id: string // id of the activity
  name: string
  description: string
  color: string
}

