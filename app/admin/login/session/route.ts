import { NextResponse, type NextRequest } from "next/server"
import { adminCookieName, adminCookieOptions, createAdminToken, getAdminPassword } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const password = String(formData.get("password") ?? "")
  const next = String(formData.get("next") ?? "/admin/licenses")
  const safeNext = next.startsWith("/admin") && next !== "/admin/login" ? next : "/admin/licenses"

  if (password !== getAdminPassword()) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("error", "1")
    loginUrl.searchParams.set("next", safeNext)
    return NextResponse.redirect(loginUrl, { status: 303 })
  }

  const response = NextResponse.redirect(new URL(safeNext, request.url), { status: 303 })
  response.cookies.set(adminCookieName, await createAdminToken(), {
    ...adminCookieOptions,
    expires: new Date(Date.now() + adminCookieOptions.maxAge * 1000),
  })
  response.headers.set("X-Admin-Login", "cookie-set")
  console.info("Admin login cookie set.", {
    cookie: adminCookieName,
    path: adminCookieOptions.path,
    secure: adminCookieOptions.secure,
    sameSite: adminCookieOptions.sameSite,
  })

  return response
}

