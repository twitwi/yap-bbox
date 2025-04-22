import type { Log } from "./typing"

export function showTime(t: number) {
  return new Date(t).toISOString().substring(11, 19)
}

export function showInstant(t?: number) {
  if (t === undefined) {
    return '??:??:??'
  }
  const d = new Date(t - (new Date().getTimezoneOffset() * 60000)).toISOString()
  //const d = new Date(t).toLoc
  //return `${d.toISOString().substring(0, 10)} ${d.toISOString().substring(11, 19)}`
  return `${d.substring(0, 10)} ${d.substring(11, 19)}`
}

export function logDuration(log: Log, now?: number) {
  now = now ?? Date.now()
  if (log.end.length === 0) {
    return now - log.start
  } else {
    return Math.min(...log.end) - log.start
  }
}
