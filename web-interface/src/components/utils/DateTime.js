const dateTime = (dateTime) => {
  const date = new Date(dateTime)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const formatedDateTime = (dateString) => {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hour = String(date.getUTCHours()).padStart(2, '0')
  const minute = String(date.getUTCMinutes()).padStart(2, '0')
  return `${day}.${month}.${year}, ${hour}:${minute} UTC`
}

const timeAgo = (dateTime) => {
  if (!dateTime) return ''
  const seconds = Math.floor((Date.now() - new Date(dateTime).getTime()) / 1000)
  if (seconds < 60) return '0 minutes'
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60)
    return `${m} minute${m > 1 ? 's' : ''}`
  }
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600)
    return `${h} hour${h > 1 ? 's' : ''}`
  }
  if (seconds < 2592000) {
    const d = Math.floor(seconds / 86400)
    return `${d} day${d > 1 ? 's' : ''}`
  }
  if (seconds < 31536000) {
    const mo = Math.floor(seconds / 2592000)
    return `${mo} month${mo > 1 ? 's' : ''}`
  }
  const y = Math.floor(seconds / 31536000)
  return `${y} year${y > 1 ? 's' : ''}`
}

const isRecent = (date) => {
  if (!date) return false
  return Date.now() - new Date(date).getTime() < 3600 * 1000
}

export { dateTime, timeAgo, isRecent }
