import Link from "next/link"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { DeviceStatusBadge, LicenseStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createCustomerAndLicenseForDevice,
  getCustomers,
  getLicenseDevice,
  getLicenses,
  updateLicenseDevice,
  type DeviceStatus,
  type ReleaseChannel,
} from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function updateDevice(id: string, formData: FormData) {
  "use server"

  await updateLicenseDevice(id, {
    status: String(formData.get("status") ?? "pending") as DeviceStatus,
    customer_id: String(formData.get("customer_id") ?? ""),
    license_id: String(formData.get("license_id") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  })

  revalidatePath("/admin/license-devices")
  revalidatePath(`/admin/license-devices/${id}`)
  redirect(`/admin/license-devices/${id}`)
}

async function createFromDevice(id: string, formData: FormData) {
  "use server"

  await createCustomerAndLicenseForDevice(id, {
    customer_name: String(formData.get("customer_name") ?? ""),
    customer_email: String(formData.get("customer_email") ?? ""),
    expires_at: String(formData.get("expires_at") ?? ""),
    grace_days: Number(formData.get("grace_days") ?? 7),
    allowed_channel: String(formData.get("allowed_channel") ?? "stable") as ReleaseChannel,
    notes: String(formData.get("license_notes") ?? ""),
  })

  revalidatePath("/admin/license-devices")
  revalidatePath(`/admin/license-devices/${id}`)
  revalidatePath("/admin/customers")
  revalidatePath("/admin/licenses")
  redirect(`/admin/license-devices/${id}`)
}

function shortHash(value: string) {
  return value ? `${value.slice(0, 16)}...` : "not provided"
}

export default async function LicenseDeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [device, customers, licenses] = await Promise.all([getLicenseDevice(id), getCustomers(), getLicenses()])

  if (!device) {
    notFound()
  }

  const linkedLicense = licenses.find((license) => license.id === device.license_id)

  return (
    <AdminShell title={device.machine_name || device.install_id} description="Approve, block, or link this GarmentsOS PRO install.">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Install details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Status</p>
              <div className="mt-1">
                <DeviceStatusBadge status={device.status} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Install ID</p>
              <p className="mt-1 font-mono">{device.install_id}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Machine hash</p>
              <p className="mt-1 font-mono">{shortHash(device.machine_hash)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">App version</p>
              <p className="mt-1">{device.app_version}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">First seen</p>
              <p className="mt-1">{new Date(device.first_seen_at).toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Last seen</p>
              <p className="mt-1">{new Date(device.last_seen_at).toLocaleString("en-US")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approve or update link</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateDevice.bind(null, device.id)} className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={device.status}
                    className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="blocked">blocked</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer_id">Customer</Label>
                  <select
                    id="customer_id"
                    name="customer_id"
                    defaultValue={device.customer_id}
                    className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">Unassigned</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="license_id">License</Label>
                  <select
                    id="license_id"
                    name="license_id"
                    defaultValue={device.license_id}
                    className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">Unassigned</option>
                    {licenses.map((license) => (
                      <option key={license.id} value={license.id}>
                        {license.client_name} - {license.license_key_preview}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" defaultValue={device.notes} />
              </div>
              <Button variant="primary" className="w-fit">
                Save device
              </Button>
            </form>
          </CardContent>
        </Card>

        {linkedLicense ? (
          <Card>
            <CardHeader>
              <CardTitle>Linked license</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-sm">
              <LicenseStatusBadge status={linkedLicense.status} />
              <Link href={`/admin/licenses/${linkedLicense.id}`} className="font-medium hover:text-accent">
                {linkedLicense.client_name}
              </Link>
              <span className="text-muted-foreground">expires {linkedLicense.expires_at}</span>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Create customer and license from this device</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createFromDevice.bind(null, device.id)} className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="customer_name">Customer name</Label>
                  <Input id="customer_name" name="customer_name" defaultValue={device.machine_name} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer_email">Customer email</Label>
                  <Input id="customer_email" name="customer_email" type="email" placeholder="customer@example.com" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="expires_at">Expires at</Label>
                  <Input id="expires_at" name="expires_at" type="date" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grace_days">Grace days</Label>
                  <Input id="grace_days" name="grace_days" type="number" min="0" defaultValue={7} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="allowed_channel">Allowed channel</Label>
                  <select
                    id="allowed_channel"
                    name="allowed_channel"
                    defaultValue="stable"
                    className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="stable">stable</option>
                    <option value="beta">beta</option>
                    <option value="dev">dev</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="license_notes">License notes</Label>
                <Textarea id="license_notes" name="license_notes" />
              </div>
              <Button variant="primary" className="w-fit">
                Create and approve
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
