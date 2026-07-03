import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { CustomerStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomers, getLicensesForCustomer } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const customers = await getCustomers()
  const counts = await Promise.all(customers.map((customer) => getLicensesForCustomer(customer.id)))

  return (
    <AdminShell
      title="Customers"
      description="Manage GarmentsOS PRO customers and their related licenses."
      action={
        <Button asChild className="rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/customers/new">
            <Plus className="h-4 w-4" />
            New customer
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Customer records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Licenses</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:text-accent">
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{customer.client_id}</TableCell>
                  <TableCell>
                    <CustomerStatusBadge status={customer.status} />
                  </TableCell>
                  <TableCell>{counts[index].length}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
