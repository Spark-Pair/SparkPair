export const adminCookieName = "sparkpair_admin"

const fallbackPassword = "sparkpair-admin"

export function getAdminPassword() {
  return process.env.SPARKPAIR_ADMIN_PASSWORD || fallbackPassword
}

export async function createAdminToken(password = getAdminPassword()) {
  const input = new TextEncoder().encode(`sparkpair-admin:${password}`)
  const hash = await crypto.subtle.digest("SHA-256", input)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export async function isAdminTokenValid(token?: string) {
  if (!token) {
    return false
  }

  return token === (await createAdminToken())
}
