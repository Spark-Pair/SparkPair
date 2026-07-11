export const adminCookieName = "sparkpair_admin"
export const adminSessionMaxAge = 60 * 60 * 24 * 7

const fallbackPassword = "sparkpair-admin"

// Keep these options identical anywhere the admin cookie is set or cleared.
// In production Vercel serves admin over HTTPS, so secure cookies are required.
export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: adminSessionMaxAge,
}

export function getAdminPassword() {
  const password = process.env.SPARKPAIR_ADMIN_PASSWORD

  if (!password && process.env.NODE_ENV === "production") {
    throw new Error("SPARKPAIR_ADMIN_PASSWORD is required in production.")
  }

  return password || fallbackPassword
}

function getAdminSessionSecret() {
  const secret = process.env.SPARKPAIR_ADMIN_SESSION_SECRET || process.env.SPARKPAIR_ADMIN_PASSWORD

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SPARKPAIR_ADMIN_SESSION_SECRET or SPARKPAIR_ADMIN_PASSWORD is required in production.")
  }

  return secret || fallbackPassword
}

async function sha256Hex(value: string) {
  const input = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest("SHA-256", input)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export async function createLegacyAdminToken(password = getAdminPassword()) {
  return sha256Hex(`sparkpair-admin:${password}`)
}

async function createAdminSignature(payload: string) {
  return sha256Hex(`${payload}:${getAdminSessionSecret()}`)
}

export async function createAdminToken() {
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = `v2.${issuedAt}`
  const signature = await createAdminSignature(payload)
  return `${payload}.${signature}`
}

export async function isAdminTokenValid(token?: string) {
  if (!token) {
    return false
  }

  const parts = token.split(".")

  if (parts.length === 3 && parts[0] === "v2") {
    const issuedAt = Number(parts[1])

    if (!Number.isFinite(issuedAt)) {
      return false
    }

    const now = Math.floor(Date.now() / 1000)
    if (issuedAt > now + 60 || now - issuedAt > adminSessionMaxAge) {
      return false
    }

    const payload = `${parts[0]}.${parts[1]}`
    return parts[2] === (await createAdminSignature(payload))
  }

  // Legacy compatibility for users who logged in before signed session tokens.
  return token === (await createLegacyAdminToken())
}

export async function setAdminSession() {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  cookieStore.set(adminCookieName, await createAdminToken(), {
    ...adminCookieOptions,
    expires: new Date(Date.now() + adminSessionMaxAge * 1000),
  })
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
  try {
    if (token !== undefined) {
      return isAdminTokenValid(token)
    }

    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    return isAdminTokenValid(cookieStore.get(adminCookieName)?.value)
  } catch (error) {
    console.error("Admin auth validation failed.", {
      message: error instanceof Error ? error.message : "Unknown auth error",
    })
    return false
  }
}

export async function requireAdmin(next = "/admin") {
  if (await isAdminAuthenticated()) {
    return
  }

  const { redirect } = await import("next/navigation")
  redirect(`/admin/login?next=${encodeURIComponent(next)}`)
}
