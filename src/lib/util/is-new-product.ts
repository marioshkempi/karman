/**
 * Supports:
 * - unix seconds      -> 1766050525
 * - unix milliseconds -> 1766050525000
 * - ISO string        -> 2025-12-18T10:27:14.633Z
 */
export function isNewProduct(
  createdAt: number | string | null | undefined,
  thresholdDays: number
): boolean {
  if (!createdAt || !thresholdDays) return false

  let createdAtMs: number | null = null

  // NUMBER input
  if (typeof createdAt === "number") {
    // detect seconds vs milliseconds
    createdAtMs = createdAt < 1e12 ? createdAt * 1000 : createdAt
  }

  // STRING input
  else if (typeof createdAt === "string") {
    // numeric string?
    if (/^\d+$/.test(createdAt)) {
      const asNum = parseInt(createdAt, 10)
      createdAtMs = asNum < 1e12 ? asNum * 1000 : asNum
    } else {
      // assume ISO date string
      const parsed = Date.parse(createdAt)
      createdAtMs = isNaN(parsed) ? null : parsed
    }
  }

  if (!createdAtMs) return false

  const now = Date.now()
  const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000

  return now - createdAtMs <= thresholdMs
}
