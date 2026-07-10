import { NextResponse, type NextRequest } from "next/server"
import { clearAdminSession } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  await clearAdminSession()
  const response = NextResponse.redirect(new URL("/admin/login", request.url))
  return response
}
