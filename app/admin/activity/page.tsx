import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminShell } from "@/components/admin/admin-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getActivityLogs } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export default async function ActivityPage() {
  const logs = await getActivityLogs(100)

  return (
    <AdminShell title="Activity" description="Recent control center changes for customers, licenses, devices, and releases.">
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.created_at).toLocaleString("en-US")}</TableCell>
                    <TableCell className="font-mono text-xs">{log.type}</TableCell>
                    <TableCell>{log.subject_type}</TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <AdminEmptyState title="No activity yet" description="Admin actions will appear here after customers, licenses, devices, or releases are changed." />
          )}
        </CardContent>
      </Card>
    </AdminShell>
  )
}
