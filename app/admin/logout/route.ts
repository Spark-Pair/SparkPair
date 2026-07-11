import { NextResponse, type NextRequest } from "next/server"
import { adminCookieName, adminCookieOptions, clearAdminSession } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  await clearAdminSession()
  const response = NextResponse.redirect(new URL("/admin/login", request.url))
  response.cookies.set(adminCookieName, "", {
    ...adminCookieOptions,
    maxAge: 0,
    expires: new Date(0),
  })
  return response
}
