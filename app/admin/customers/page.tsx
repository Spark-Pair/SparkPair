import Link from "next/link"
import { revalidatePath } from "next/cache"
import { Archive, Trash2 } from "lucide-react"
import { Plus } from "lucide-react"
import { AdminActionItem, AdminRowActions, AdminViewEditActions } from "@/components/admin/admin-actions"
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableActions, AdminTableCard } from "@/components/admin/admin-table"
import { CustomerStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { archiveCustomer, deleteCustomerIfSafe, getCustomers, getLicensesForCustomer } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function archiveCustomerAction(formData: FormData) {
  "use server"
  await archiveCustomer(String(formData.get("id") ?? ""))
  revalidatePath("/admin/customers")
}

async function deleteCustomerAction(formData: FormData) {
  "use server"
  await deleteCustomerIfSafe(String(formData.get("id") ?? ""))
  revalidatePath("/admin/customers")
}

export default async function CustomersPage() {
  const customers = await getCustomers()
  const counts = await Promise.all(customers.map((customer) => getLicensesForCustomer(customer.id)))

  return (
    <AdminShell
      title="Customers"
      description="Manage GarmentsOS PRO customers and their related licenses."
      action={
        <Button asChild variant="primary">
          <Link href="/admin/customers/new">
            <Plus className="h-4 w-4" />
            New customer
          </Link>
        </Button>
      }
    >
      <AdminTableCard title="Customer records">
          {customers.length ? (
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="min-w-56 px-5 py-3">Name</TableHead>
                  <TableHead className="min-w-44">Client ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead className="min-w-56">Email</TableHead>
                  <TableHead className="px-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow key={customer.id} className="hover:bg-muted/25">
                    <TableCell className="px-5 py-4">
                      <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:text-accent">
                        {customerDisplayName(customer)}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{customer.client_id}</TableCell>
                    <TableCell>
                      <CustomerStatusBadge status={customer.status} />
                    </TableCell>
                    <TableCell>{counts[index].length}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="px-5 py-4">
                      <AdminTableActions>
                        <AdminViewEditActions href={`/admin/customers/${customer.id}`} />
                        <AdminRowActions>
                        {customer.status === "active" ? (
                          <form action={archiveCustomerAction}>
                            <input type="hidden" name="id" value={customer.id} />
                            <AdminActionItem>
                              <AdminConfirmButton
                                title="Archive customer?"
                                description="The customer will become inactive, but licenses and devices remain for history."
                                confirmLabel="Archive"
                                variant="secondary"
                              >
                                <Archive className="h-4 w-4" />
                                Archive
                              </AdminConfirmButton>
                            </AdminActionItem>
                          </form>
                        ) : null}
                        <form action={deleteCustomerAction}>
                          <input type="hidden" name="id" value={customer.id} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Delete customer?"
                            description="Deletion only succeeds when there are no licenses or devices attached. Otherwise archive the customer."
                            confirmLabel="Delete"
                            variant="destructive_invert"
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
            <AdminEmptyState title="No customers yet" description="Create a customer before issuing licenses or approving devices." />
          )}
      </AdminTableCard>
    </AdminShell>
  )
}

function customerDisplayName(customer: Awaited<ReturnType<typeof getCustomers>>[number]) {
  return customer.name || customer.client_id || "Unnamed customer"
}
