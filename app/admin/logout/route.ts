import { NextResponse, type NextRequest } from "next/server"
import { adminCookieName } from "@/lib/admin-auth"

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url))
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
