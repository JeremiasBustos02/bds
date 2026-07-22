export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1]
    if (!payload) return true
    const decoded = JSON.parse(atob(payload))
    if (!decoded.exp) return true
    return Date.now() >= decoded.exp * 1000
  } catch {
    return true
  }
}
