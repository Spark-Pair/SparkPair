import { NextResponse, type NextRequest } from "next/server"
import { adminCookieName, isAdminTokenValid } from "@/lib/admin-auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next()
  }

  const token = request.cookies.get(adminCookieName)?.value

  if (await isAdminTokenValid(token)) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/admin/login", request.url)
  loginUrl.searchParams.set("next", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/admin/:path*"],
}
