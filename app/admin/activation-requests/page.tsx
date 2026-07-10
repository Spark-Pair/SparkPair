import Link from "next/link"
import { revalidatePath } from "next/cache"
import { XCircle } from "lucide-react"
import { AdminActionItem, AdminRowActions, AdminViewEditActions } from "@/components/admin/admin-actions"
import { AdminActionNotice } from "@/components/admin/admin-action-notice"
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableActions, AdminTableCard } from "@/components/admin/admin-table"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminActionRedirect, getAdminActionNotice } from "@/lib/admin-action-feedback"
import { getActivationRequests, rejectActivationRequest } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

function RequestStatusBadge({ status }: { status: string }) {
  const className =
    status === "approved"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "rejected"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-amber-200 bg-amber-50 text-amber-700"

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  )
}

async function rejectRequestAction(formData: FormData) {
  "use server"
  await rejectActivationRequest(String(formData.get("id") ?? ""), String(formData.get("notes") ?? "Rejected from request list."))
  revalidatePath("/admin/activation-requests")
  adminActionRedirect("/admin/activation-requests", "success", "Activation request rejected.")
}

export default async function ActivationRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ actionStatus?: string; actionMessage?: string }>
}) {
  const notice = await getAdminActionNotice(searchParams)
  const requests = await getActivationRequests()

  return (
    <AdminShell
      title="Activation Requests"
      description="Fresh GarmentsOS PRO installs can request a demo trial or paid activation. Approve a request to create or link the customer, license, and device."
    >
      <AdminActionNotice status={notice.status} message={notice.message} />
      <AdminTableCard title="Requests">
          {requests.length ? (
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="min-w-56 px-5 py-3">Business</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-64">Device</TableHead>
                  <TableHead className="min-w-48">Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="px-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/25">
                    <TableCell className="px-5 py-4">
                      <Link href={`/admin/activation-requests/${request.id}`} className="font-medium hover:text-accent">
                        {request.business_name || request.owner_name || request.machine_name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{request.city || "city not provided"}</p>
                    </TableCell>
                    <TableCell>{request.request_type.replace("_", " ")}</TableCell>
                    <TableCell>
                      <RequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      <p>{request.machine_name || "not named"}</p>
                      <p className="font-mono text-xs text-muted-foreground">{request.install_id}</p>
                    </TableCell>
                    <TableCell>
                      <p>{request.phone || "no phone"}</p>
                      <p className="text-xs text-muted-foreground">{request.email || "no email"}</p>
                    </TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleString("en-US")}</TableCell>
                    <TableCell className="px-5 py-4">
                      <AdminTableActions>
                        <AdminViewEditActions href={`/admin/activation-requests/${request.id}`} />
                        <AdminRowActions>
                        {request.status === "pending" ? (
                          <form action={rejectRequestAction}>
                            <input type="hidden" name="id" value={request.id} />
                            <input type="hidden" name="notes" value={request.notes} />
                            <AdminActionItem>
                            <AdminConfirmButton
                              title="Reject activation request?"
                              description="The request will be marked rejected. This does not delete any linked customer, license, or device."
                              confirmLabel="Reject"
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
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
            <AdminEmptyState title="No activation requests" description="Fresh installs will appear here after they submit a demo trial or paid activation request." />
          )}
      </AdminTableCard>
    </AdminShell>
  )
}
