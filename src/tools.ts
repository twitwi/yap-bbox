import type { Log } from "./typing"

export function showTime(t: number, simple: boolean = false) {
  if (simple) {
    return new Date(t).toISOString().substring(11, 19)
  } else {
    t = Math.floor(t / 1000)
    const h = Math.floor(t / 3600)
    const m = Math.floor((t % 3600) / 60)
    const s = Math.floor(t % 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
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
