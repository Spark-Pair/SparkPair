import { redirect } from "next/navigation"

export type AdminActionStatus = "success" | "error"

export function adminActionRedirect(path: string, status: AdminActionStatus, message: string): never {
  redirect(`${path}?actionStatus=${status}&actionMessage=${encodeURIComponent(message)}`)
}

export async function getAdminActionNotice(searchParams?: Promise<{ actionStatus?: string; actionMessage?: string }>) {
  const params = searchParams ? await searchParams : {}
  const status = params.actionStatus === "success" || params.actionStatus === "error" ? params.actionStatus : undefined
  const message = typeof params.actionMessage === "string" ? params.actionMessage : undefined

  return { status, message }
}
