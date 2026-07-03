import Link from "next/link"
import { AdminShell } from "@/components/admin/admin-shell"
import { DeviceStatusBadge } from "@/components/garmentsos-pro/status-badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomers, getLicenseDevices, getLicenses } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

function shortHash(value: string) {
  return value ? `${value.slice(0, 10)}...` : "not provided"
}

export default async function LicenseDevicesPage() {
  const [devices, customers, licenses] = await Promise.all([getLicenseDevices(), getCustomers(), getLicenses()])
  const customerById = new Map(customers.map((customer) => [customer.id, customer]))
  const licenseById = new Map(licenses.map((license) => [license.id, license]))

  return (
    <AdminShell
      title="License Devices"
      description="Review install registrations and approve, block, or link devices to customer licenses."
    >
      <Card>
        <CardHeader>
          <CardTitle>Registered installs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Machine hash</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>Linked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <Link href={`/admin/license-devices/${device.id}`} className="font-medium hover:text-accent">
                      {device.machine_name || device.install_id}
                    </Link>
                    <p className="font-mono text-xs text-muted-foreground">{device.install_id}</p>
                  </TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
