export function cleanSearchParams(
  searchParams: Record<string, string | undefined>
): Record<string, string> {
  return Object.entries(searchParams).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, string>)
}