import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { LicenseStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomers, getLicenses } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export default async function LicensesAdminPage() {
  const [licenses, customers] = await Promise.all([getLicenses(), getCustomers()])
  const customerById = new Map(customers.map((customer) => [customer.id, customer]))

  return (
    <AdminShell
      title="Licenses"
      description="Create, review, and update GarmentsOS PRO customer licenses."
      action={
        <Button asChild className="rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/licenses/new">
            <Plus className="h-4 w-4" />
            New license
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>License records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Install</TableHead>
                <TableHead>Key</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell>
                    <Link href={`/admin/licenses/${license.id}`} className="font-medium hover:text-accent">
                      {customerById.get(license.customer_id)?.name ?? license.client_name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{license.client_id}</TableCell>
                  <TableCell>
                    <LicenseStatusBadge status={license.status} />
                  </TableCell>
                  <TableCell>{license.expires_at}</TableCell>
                  <TableCell>{license.install_id || "unbound"}</TableCell>
                  <TableCell className="font-mono text-xs">{license.license_key_preview}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
