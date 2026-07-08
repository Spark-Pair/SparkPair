import Link from "next/link"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { CustomerForm } from "@/components/garmentsos-pro/customer-form"
import { DeviceStatusBadge, LicenseStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomer, getLicenseDevices, getLicensesForCustomer, saveCustomer, type CustomerStatus } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function updateCustomer(id: string, formData: FormData) {
  "use server"

  await saveCustomer(
    {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      client_id: String(formData.get("client_id") ?? ""),
      status: String(formData.get("status") ?? "active") as CustomerStatus,
      notes: String(formData.get("notes") ?? ""),
    },
    id,
  )

  revalidatePath("/admin/customers")
  revalidatePath(`/admin/customers/${id}`)
  redirect(`/admin/customers/${id}`)
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [customer, licenses, allDevices] = await Promise.all([getCustomer(id), getLicensesForCustomer(id), getLicenseDevices()])

  if (!customer) {
    notFound()
  }

  const devices = allDevices.filter((device) => device.customer_id === customer.id)

  return (
    <AdminShell title={customer.name} description="Edit customer details and review related licenses.">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer details</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm action={updateCustomer.bind(null, customer.id)} customer={customer} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Related licenses</CardTitle>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/admin/licenses/new">New license</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {licenses.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Key</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell>
                      <Link href={`/admin/licenses/${license.id}`} className="font-medium hover:text-accent">
                        {license.client_id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <LicenseStatusBadge status={license.status} />
                    </TableCell>
                    <TableCell>{license.expires_at}</TableCell>
                    <TableCell className="font-mono text-xs">{license.license_key_preview}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            ) : (
              <AdminEmptyState title="No licenses" description="This customer does not have a license yet." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related devices</CardTitle>
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
                      <TableCell>
                        <Link href={`/admin/license-devices/${device.id}`} className="font-medium hover:text-accent">
                          {device.install_id}
                        </Link>
                      </TableCell>
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
              <AdminEmptyState title="No devices" description="Approved or pending installs linked to this customer will appear here." />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
