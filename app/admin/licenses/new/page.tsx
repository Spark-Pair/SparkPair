import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { LicenseForm } from "@/components/garmentsos-pro/license-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomers, saveLicense, type LicenseStatus, type ReleaseChannel } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function createLicense(formData: FormData) {
  "use server"

  const result = await saveLicense({
    customer_id: String(formData.get("customer_id") ?? ""),
    client_id: String(formData.get("client_id") ?? ""),
    client_name: String(formData.get("client_name") ?? ""),
    plain_key: String(formData.get("plain_key") ?? ""),
    status: String(formData.get("status") ?? "active") as LicenseStatus,
    expires_at: String(formData.get("expires_at") ?? ""),
    grace_days: Number(formData.get("grace_days") ?? 7),
    allowed_channel: String(formData.get("allowed_channel") ?? "stable") as ReleaseChannel,
    install_id: String(formData.get("install_id") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  })

  if (result.plain_key) {
    const cookieStore = await cookies()
    cookieStore.set(`license_key_${result.license.id}`, result.plain_key, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
      maxAge: 60,
    })
  }

  revalidatePath("/admin/licenses")
  redirect(`/admin/licenses/${result.license.id}`)
}

export default async function NewLicensePage() {
  const customers = await getCustomers()

  return (
    <AdminShell title="New License" description="Issue a GarmentsOS PRO license key for a customer installation.">
      <Card>
        <CardHeader>
          <CardTitle>License details</CardTitle>
        </CardHeader>
        <CardContent>
          <LicenseForm action={createLicense} customers={customers} />
        </CardContent>
      </Card>
    </AdminShell>
  )
}
