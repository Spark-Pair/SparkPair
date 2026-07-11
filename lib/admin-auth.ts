export const adminCookieName = "sparkpair_admin"
export const adminSessionMaxAge = 60 * 60 * 24 * 7

const fallbackPassword = "sparkpair-admin"

export type AdminSessionValidationReason =
  | "valid"
  | "missing_cookie"
  | "expired"
  | "bad_signature"
  | "missing_secret"
  | "legacy_token"
  | "invalid_format"
  | "validation_error"

export type AdminSessionValidation = {
  authenticated: boolean
  reason: AdminSessionValidationReason
}

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
  const secret = process.env.SPARKPAIR_ADMIN_SESSION_SECRET

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SPARKPAIR_ADMIN_SESSION_SECRET is required in production.")
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
  return (await validateAdminSessionToken(token)).authenticated
}

export async function validateAdminSessionToken(token?: string): Promise<AdminSessionValidation> {
  if (!token) {
    return { authenticated: false, reason: "missing_cookie" }
  }

  const parts = token.split(".")

  if (parts.length === 3 && parts[0] === "v2") {
    if (!process.env.SPARKPAIR_ADMIN_SESSION_SECRET && process.env.NODE_ENV === "production") {
      return { authenticated: false, reason: "missing_secret" }
    }

    const issuedAt = Number(parts[1])

    if (!Number.isFinite(issuedAt)) {
      return { authenticated: false, reason: "invalid_format" }
    }

    const now = Math.floor(Date.now() / 1000)
    if (issuedAt > now + 60 || now - issuedAt > adminSessionMaxAge) {
      return { authenticated: false, reason: "expired" }
    }

    const payload = `${parts[0]}.${parts[1]}`
    const valid = parts[2] === (await createAdminSignature(payload))
    return valid ? { authenticated: true, reason: "valid" } : { authenticated: false, reason: "bad_signature" }
  }

  // Legacy compatibility for users who logged in before signed session tokens.
  const validLegacyToken = token === (await createLegacyAdminToken())
  return validLegacyToken ? { authenticated: true, reason: "legacy_token" } : { authenticated: false, reason: "bad_signature" }
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

export function logAdminSessionValidationFailure(result: AdminSessionValidation, path = "/admin") {
  if (result.authenticated) {
    if (result.reason === "legacy_token") {
      console.info("Admin session validated with legacy token.", { path, reason: result.reason })
    }
    return
  }

  console.warn("Admin session validation failed.", {
    path,
    reason: result.reason,
  })
}

export async function validateAdminSession(token?: string): Promise<AdminSessionValidation> {
  try {
    if (token !== undefined) {
      return validateAdminSessionToken(token)
    }

    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    return validateAdminSessionToken(cookieStore.get(adminCookieName)?.value)
  } catch (error) {
    console.error("Admin auth validation failed.", {
      message: error instanceof Error ? error.message : "Unknown auth error",
    })
    return { authenticated: false, reason: "validation_error" }
  }
}

export async function isAdminAuthenticated(token?: string, options?: { logFailures?: boolean; path?: string }) {
  const result = await validateAdminSession(token)

  if (options?.logFailures) {
    logAdminSessionValidationFailure(result, options.path)
  }

  return result.authenticated
}

export async function requireAdmin(next = "/admin") {
  const result = await validateAdminSession()

  if (result.authenticated) {
    return
  }

  logAdminSessionValidationFailure(result, next)

  const { redirect } = await import("next/navigation")
  redirect(`/admin/login?next=${encodeURIComponent(next)}`)
}
