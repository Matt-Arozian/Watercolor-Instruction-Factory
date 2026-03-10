const buckets = new Map()

export function checkRateLimit(key, maxRequests = 10, windowMs = 60_000) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, { windowStart: now, count: 1 })
    return true
  }

  if (bucket.count >= maxRequests) {
    return false
  }

  bucket.count += 1
  return true
}
