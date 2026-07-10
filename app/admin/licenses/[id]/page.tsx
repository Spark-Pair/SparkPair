import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { PauseCircle, PlayCircle, Trash2 } from "lucide-react"
import { AdminActionNotice } from "@/components/admin/admin-action-notice"
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminShell } from "@/components/admin/admin-shell"
import { LicenseForm } from "@/components/garmentsos-pro/license-form"
import { DeviceStatusBadge, LicenseStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  deleteLicenseIfSafe,
  getCustomers,
  getLicense,
  getLicenseChecks,
  getLicenseDevices,
  saveLicense,
  updateLicenseStatus,
  type LicenseStatus,
  type ReleaseChannel,
} from "@/lib/garmentsos-pro"
import { AdminActionItem } from "@/components/admin/admin-actions"
import { adminActionRedirect, getAdminActionNotice } from "@/lib/admin-action-feedback"

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
      allowed_devices: Number(formData.get("allowed_devices") ?? 1),
      install_id: String(formData.get("install_id") ?? ""),
      machine_hash: String(formData.get("machine_hash") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    },
    id,
  )

  revalidatePath("/admin/licenses")
  revalidatePath(`/admin/licenses/${id}`)
  adminActionRedirect(`/admin/licenses/${id}`, "success", "License updated.")
}

async function suspendLicense(id: string) {
  "use server"
  await updateLicenseStatus(id, "suspended")
  revalidatePath("/admin/licenses")
  revalidatePath(`/admin/licenses/${id}`)
  adminActionRedirect(`/admin/licenses/${id}`, "success", "License suspended.")
}

async function reactivateLicense(id: string) {
  "use server"
  await updateLicenseStatus(id, "active")
  revalidatePath("/admin/licenses")
  revalidatePath(`/admin/licenses/${id}`)
  adminActionRedirect(`/admin/licenses/${id}`, "success", "License reactivated.")
}

async function deleteLicense(id: string) {
  "use server"
  const result = await deleteLicenseIfSafe(id)
  revalidatePath("/admin/licenses")
  if (!result.ok) {
    revalidatePath(`/admin/licenses/${id}`)
    adminActionRedirect(`/admin/licenses/${id}`, "error", result.message)
  }
  adminActionRedirect("/admin/licenses", "success", result.message)
}

export default async function LicenseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ actionStatus?: string; actionMessage?: string }>
}) {
  const { id } = await params
  const notice = await getAdminActionNotice(searchParams)
  const cookieStore = await cookies()
  const [license, customers, checks, allDevices] = await Promise.all([getLicense(id), getCustomers(), getLicenseChecks(id), getLicenseDevices()])
  const oneTimeKey = cookieStore.get(`license_key_${id}`)?.value

  if (!license) {
    notFound()
  }

  const devices = allDevices.filter((device) => device.license_id === license.id)

  return (
    <AdminShell title={license.client_name} description="Review license details and verification history.">
      <AdminActionNotice status={notice.status} message={notice.message} />
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
            {license.status === "suspended" ? (
              <span className="mt-2 block">Suspended licenses return valid:false until reactivated.</span>
            ) : null}
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-3">
          {license.status === "suspended" ? (
            <form action={reactivateLicense.bind(null, license.id)}>
              <AdminActionItem>
                <AdminConfirmButton title="Reactivate license?" description="The app can verify again if the license is not expired." confirmLabel="Reactivate">
                  <PlayCircle className="h-4 w-4" />
                  Reactivate
                </AdminConfirmButton>
              </AdminActionItem>
            </form>
          ) : (
            <form action={suspendLicense.bind(null, license.id)}>
              <AdminActionItem>
                <AdminConfirmButton title="Suspend license?" description="Linked approved devices will fail verification until reactivated." confirmLabel="Suspend" variant="warning_invert">
                  <PauseCircle className="h-4 w-4" />
                  Suspend
                </AdminConfirmButton>
              </AdminActionItem>
            </form>
          )}
          <form action={deleteLicense.bind(null, license.id)}>
            <AdminActionItem>
              <AdminConfirmButton
                title="Delete license?"
                description="Deletion only succeeds when no approved devices are linked."
                confirmLabel="Delete"
                variant="destructive_invert"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </AdminConfirmButton>
            </AdminActionItem>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Linked devices</CardTitle>
          </CardHeader>
          <CardContent>
            {devices.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Install</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Last seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>{device.install_id}</TableCell>
                      <TableCell>
                        <DeviceStatusBadge status={device.status} />
                      </TableCell>
                      <TableCell>{device.machine_name || "Unnamed device"}</TableCell>
                      <TableCell>{new Date(device.last_seen_at).toLocaleString("en-US")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <AdminEmptyState title="No linked devices" description="Approved installs attached to this license will appear here." />
            )}
          </CardContent>
        </Card>

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
