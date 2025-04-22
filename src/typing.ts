

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


export const DUMMY_LOG: Log = {
  activity: '___dummy',
  comment: 'dummy',
  start: Date.now(),
  end: [Date.now()],
}
export const DUMMY_ACTIVITY: Activity = {
  id: '___dummy',
  name: 'dummy',
  description: 'dummy',
  color: '#FF00FF',
}
