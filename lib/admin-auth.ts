export const adminCookieName = "sparkpair_admin"
export const adminSessionMaxAge = 60 * 60 * 24 * 7

const fallbackPassword = "sparkpair-admin"

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: adminSessionMaxAge,
}

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

export async function setAdminSession(password = getAdminPassword()) {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  cookieStore.set(adminCookieName, await createAdminToken(password), adminCookieOptions)
}

export async function clearAdminSession() {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  cookieStore.set(adminCookieName, "", {
    ...adminCookieOptions,
    maxAge: 0,
  })
}

export function getAdminTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return undefined
  }

  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminCookieName}=`))
    ?.split("=")
    .slice(1)
    .join("=")
}

export async function isAdminAuthenticated(token?: string) {
  if (token !== undefined) {
    return isAdminTokenValid(token)
  }

  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  return isAdminTokenValid(cookieStore.get(adminCookieName)?.value)
}

export async function requireAdmin(next = "/admin") {
  if (await isAdminAuthenticated()) {
    return
  }

  const { redirect } = await import("next/navigation")
  redirect(`/admin/login?next=${encodeURIComponent(next)}`)
}
