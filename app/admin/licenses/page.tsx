import Link from "next/link"
import { revalidatePath } from "next/cache"
import { PauseCircle, PlayCircle, Plus, Trash2 } from "lucide-react"
import { AdminActionItem, AdminRowActions, AdminViewEditActions } from "@/components/admin/admin-actions"
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableActions, AdminTableCard } from "@/components/admin/admin-table"
import { LicenseStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteLicenseIfSafe, getCustomers, getLicenses, getProducts, updateLicenseStatus } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function suspendLicenseAction(formData: FormData) {
  "use server"
  await updateLicenseStatus(String(formData.get("id") ?? ""), "suspended")
  revalidatePath("/admin/licenses")
}

async function reactivateLicenseAction(formData: FormData) {
  "use server"
  await updateLicenseStatus(String(formData.get("id") ?? ""), "active")
  revalidatePath("/admin/licenses")
}

async function deleteLicenseAction(formData: FormData) {
  "use server"
  await deleteLicenseIfSafe(String(formData.get("id") ?? ""))
  revalidatePath("/admin/licenses")
}

export default async function LicensesAdminPage() {
  const [licenses, customers, products] = await Promise.all([getLicenses(), getCustomers(), getProducts()])
  const customerById = new Map(customers.map((customer) => [customer.id, customer]))
  const productByKey = new Map(products.map((product) => [product.product_key, product]))

  return (
    <AdminShell
      title="Licenses"
      description="Create, review, and update GarmentsOS PRO customer licenses."
      action={
        <Button asChild variant="primary">
          <Link href="/admin/licenses/new">
            <Plus className="h-4 w-4" />
            New license
          </Link>
        </Button>
      }
    >
      <AdminTableCard title="License records">
          {licenses.length ? (
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="min-w-56 px-5 py-3">Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="min-w-44">Client ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Install</TableHead>
                <TableHead>Key</TableHead>
                <TableHead className="px-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id} className="hover:bg-muted/25">
                  <TableCell className="px-5 py-4">
                    <Link href={`/admin/licenses/${license.id}`} className="font-medium hover:text-accent">
                      {customerById.get(license.customer_id)?.name ?? license.client_name}
                    </Link>
                  </TableCell>
                  <TableCell>{productByKey.get(license.product_key)?.name ?? license.product_key}</TableCell>
                  <TableCell className="font-mono text-xs">{license.client_id}</TableCell>
                  <TableCell>
                    <LicenseStatusBadge status={license.status} />
                  </TableCell>
                  <TableCell>{license.expires_at}</TableCell>
                  <TableCell>{license.install_id || "unbound"}</TableCell>
                  <TableCell className="font-mono text-xs">{license.license_key_preview}</TableCell>
                  <TableCell className="px-5 py-4">
                    <AdminTableActions>
                      <AdminViewEditActions href={`/admin/licenses/${license.id}`} />
                      <AdminRowActions>
                      {license.status === "suspended" ? (
                        <form action={reactivateLicenseAction}>
                          <input type="hidden" name="id" value={license.id} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Reactivate license?"
                            description="The linked approved devices will be able to verify again if the license is not expired."
                            confirmLabel="Reactivate"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Reactivate
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                      ) : (
                        <form action={suspendLicenseAction}>
                          <input type="hidden" name="id" value={license.id} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Suspend license?"
                            description="Suspended licenses return valid:false to the client app until reactivated."
                            confirmLabel="Suspend"
                          >
                            <PauseCircle className="h-4 w-4" />
                            Suspend
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                      )}
                      <form action={deleteLicenseAction}>
                        <input type="hidden" name="id" value={license.id} />
                        <AdminActionItem>
                        <AdminConfirmButton
                          title="Delete license?"
                          description="Deletion only succeeds when no approved devices are linked. Suspend instead for active customers."
                          confirmLabel="Delete"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </AdminConfirmButton>
                        </AdminActionItem>
                      </form>
                      </AdminRowActions>
                    </AdminTableActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
            <AdminEmptyState title="No licenses yet" description="Create a license manually or approve a pending device to create one automatically." />
          )}
      </AdminTableCard>
    </AdminShell>
  )
}
