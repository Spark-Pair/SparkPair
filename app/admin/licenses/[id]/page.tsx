import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { LicenseForm } from "@/components/garmentsos-pro/license-form"
import { LicenseStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomers, getLicense, getLicenseChecks, saveLicense, type LicenseStatus, type ReleaseChannel } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function updateLicense(id: string, formData: FormData) {
  "use server"

  await saveLicense(
    {
      customer_id: String(formData.get("customer_id") ?? ""),
      client_id: String(formData.get("client_id") ?? ""),
      client_name: String(formData.get("client_name") ?? ""),
      status: String(formData.get("status") ?? "active") as LicenseStatus,
      expires_at: String(formData.get("expires_at") ?? ""),
      grace_days: Number(formData.get("grace_days") ?? 7),
      allowed_channel: String(formData.get("allowed_channel") ?? "stable") as ReleaseChannel,
      install_id: String(formData.get("install_id") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    },
    id,
  )

  revalidatePath("/admin/licenses")
  revalidatePath(`/admin/licenses/${id}`)
  redirect(`/admin/licenses/${id}`)
}

export default async function LicenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const [license, customers, checks] = await Promise.all([getLicense(id), getCustomers(), getLicenseChecks(id)])
  const oneTimeKey = cookieStore.get(`license_key_${id}`)?.value

  if (!license) {
    notFound()
  }

  return (
    <AdminShell title={license.client_name} description="Review license details and verification history.">
      <div className="grid gap-8">
        {oneTimeKey ? (
          <Alert>
            <AlertTitle>Copy this license key now</AlertTitle>
            <AlertDescription>
              <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">{oneTimeKey}</code>
              <span className="mt-2 block">This full key is shown once. After this, only the masked preview is stored.</span>
            </AlertDescription>
          </Alert>
        ) : null}

        <Alert>
          <AlertTitle>Current status</AlertTitle>
          <AlertDescription>
            <LicenseStatusBadge status={license.status} /> <span className="ml-2">Key preview: {license.license_key_preview}</span>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>License details</CardTitle>
          </CardHeader>
          <CardContent>
            <LicenseForm action={updateLicense.bind(null, license.id)} license={license} customers={customers} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License checks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Checked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid</TableHead>
                  <TableHead>Install ID</TableHead>
                  <TableHead>Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>{new Date(check.checked_at).toLocaleString("en-US")}</TableCell>
                    <TableCell>{check.status}</TableCell>
                    <TableCell>{check.valid ? "true" : "false"}</TableCell>
                    <TableCell>{check.install_id}</TableCell>
                    <TableCell>{check.app_version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
