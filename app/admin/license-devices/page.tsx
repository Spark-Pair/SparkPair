import Link from "next/link"
import { revalidatePath } from "next/cache"
import { Ban, Trash2, Unlock } from "lucide-react"
import { AdminActionItem, AdminRowActions, AdminViewEditActions } from "@/components/admin/admin-actions"
import { AdminActionNotice } from "@/components/admin/admin-action-notice"
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableActions, AdminTableCard } from "@/components/admin/admin-table"
import { DeviceStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminActionRedirect, getAdminActionNotice } from "@/lib/admin-action-feedback"
import { deleteStalePendingDevice, getCustomers, getLicenseDevices, getLicenses, getProducts, updateLicenseDevice } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

function shortHash(value: string) {
  return value ? `${value.slice(0, 10)}...` : "not provided"
}

async function blockDeviceAction(formData: FormData) {
  "use server"
  await updateLicenseDevice(String(formData.get("id") ?? ""), {
    status: "blocked",
    customer_id: String(formData.get("customer_id") ?? ""),
    license_id: String(formData.get("license_id") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  })
  revalidatePath("/admin/license-devices")
  adminActionRedirect("/admin/license-devices", "success", "Device blocked.")
}

async function unblockDeviceAction(formData: FormData) {
  "use server"
  await updateLicenseDevice(String(formData.get("id") ?? ""), {
    status: "pending",
    customer_id: String(formData.get("customer_id") ?? ""),
    license_id: String(formData.get("license_id") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  })
  revalidatePath("/admin/license-devices")
  adminActionRedirect("/admin/license-devices", "success", "Device returned to pending.")
}

async function deleteDeviceAction(formData: FormData) {
  "use server"
  const result = await deleteStalePendingDevice(String(formData.get("id") ?? ""))
  revalidatePath("/admin/license-devices")
  adminActionRedirect("/admin/license-devices", result.ok ? "success" : "error", result.message)
}

export default async function LicenseDevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ actionStatus?: string; actionMessage?: string }>
}) {
  const notice = await getAdminActionNotice(searchParams)
  const [devices, customers, licenses, products] = await Promise.all([getLicenseDevices(), getCustomers(), getLicenses(), getProducts()])
  const customerById = new Map(customers.map((customer) => [customer.id, customer]))
  const licenseById = new Map(licenses.map((license) => [license.id, license]))
  const productByKey = new Map(products.map((product) => [product.product_key, product]))

  return (
    <AdminShell
      title="License Devices"
      description="Pending devices are fresh installs awaiting approval. Approved devices can verify licenses. Blocked devices are denied."
    >
      <AdminActionNotice status={notice.status} message={notice.message} />
      <AdminTableCard title="Registered installs">
          {devices.length ? (
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="min-w-64 px-5 py-3">Device</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Machine hash</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>Linked</TableHead>
                <TableHead className="px-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id} className="hover:bg-muted/25">
                  <TableCell className="px-5 py-4">
                    <Link href={`/admin/license-devices/${device.id}`} className="font-medium hover:text-accent">
                      {device.machine_name || device.install_id}
                    </Link>
                    <p className="font-mono text-xs text-muted-foreground">{device.install_id}</p>
                  </TableCell>
                  <TableCell>{productByKey.get(device.product_key)?.name ?? device.product_key}</TableCell>
                  <TableCell>
                    <DeviceStatusBadge status={device.status} />
                  </TableCell>
                  <TableCell>{device.app_version}</TableCell>
                  <TableCell className="font-mono text-xs">{shortHash(device.machine_hash)}</TableCell>
                  <TableCell>{new Date(device.last_seen_at).toLocaleString("en-US")}</TableCell>
                  <TableCell>
                    {customerById.get(device.customer_id)?.name ?? "unassigned"}
                    {device.license_id ? (
                      <p className="text-xs text-muted-foreground">{licenseById.get(device.license_id)?.license_key_preview}</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <AdminTableActions>
                      <AdminViewEditActions href={`/admin/license-devices/${device.id}`} />
                      <AdminRowActions>
                      {device.status === "blocked" ? (
                        <form action={unblockDeviceAction}>
                          <input type="hidden" name="id" value={device.id} />
                          <input type="hidden" name="customer_id" value={device.customer_id} />
                          <input type="hidden" name="license_id" value={device.license_id} />
                          <input type="hidden" name="notes" value={device.notes} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Unblock device?"
                            description="The device will return to pending until approved and linked again."
                            confirmLabel="Unblock"
                          >
                            <Unlock className="h-4 w-4" />
                            Unblock
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                      ) : (
                        <form action={blockDeviceAction}>
                          <input type="hidden" name="id" value={device.id} />
                          <input type="hidden" name="customer_id" value={device.customer_id} />
                          <input type="hidden" name="license_id" value={device.license_id} />
                          <input type="hidden" name="notes" value={device.notes} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Block device?"
                            description="Blocked devices cannot activate, even if they were previously approved."
                            confirmLabel="Block"
                          >
                            <Ban className="h-4 w-4" />
                            Block
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                      )}
                      {device.status === "pending" ? (
                        <form action={deleteDeviceAction}>
                          <input type="hidden" name="id" value={device.id} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Delete pending registration?"
                            description="Only unlinked pending registrations can be deleted. This is useful for stale test installs."
                            confirmLabel="Delete"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                      ) : null}
                      </AdminRowActions>
                    </AdminTableActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
            <AdminEmptyState title="No devices registered" description="Fresh GarmentsOS PRO installs will appear here as pending devices after they call the register-install API." />
          )}
      </AdminTableCard>
    </AdminShell>
  )
}
