import Link from "next/link"
import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  approveActivationRequest,
  getActivationRequest,
  getCustomers,
  getLicenses,
  rejectActivationRequest,
  type ReleaseChannel,
} from "@/lib/garmentsos-pro"

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

async function approveRequest(id: string, formData: FormData) {
  "use server"
  await approveActivationRequest(id, {
    customer_id: String(formData.get("customer_id") ?? ""),
    license_id: String(formData.get("license_id") ?? ""),
    customer_name: String(formData.get("customer_name") ?? ""),
    customer_email: String(formData.get("customer_email") ?? ""),
    expires_at: String(formData.get("expires_at") ?? ""),
    grace_days: Number(formData.get("grace_days") ?? 7),
    allowed_channel: String(formData.get("allowed_channel") ?? "stable") as ReleaseChannel,
    notes: String(formData.get("notes") ?? ""),
  })
  revalidatePath("/admin/activation-requests")
  revalidatePath(`/admin/activation-requests/${id}`)
  revalidatePath("/admin/customers")
  revalidatePath("/admin/licenses")
  revalidatePath("/admin/license-devices")
  redirect(`/admin/activation-requests/${id}`)
}

async function rejectRequest(id: string, formData: FormData) {
  "use server"
  await rejectActivationRequest(id, String(formData.get("notes") ?? ""))
  revalidatePath("/admin/activation-requests")
  revalidatePath(`/admin/activation-requests/${id}`)
  redirect(`/admin/activation-requests/${id}`)
}

function defaultExpiry() {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().slice(0, 10)
}

export default async function ActivationRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [request, customers, licenses] = await Promise.all([getActivationRequest(id), getCustomers(), getLicenses()])

  if (!request) {
    notFound()
  }

  return (
    <AdminShell title={request.business_name || request.machine_name || "Activation Request"} description="Approve this request to activate the linked install without asking the client app user for a license key.">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              Request details
              <RequestStatusBadge status={request.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Business</p>
              <p className="mt-1">{request.business_name || "not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Owner</p>
              <p className="mt-1">{request.owner_name || "not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Phone</p>
              <p className="mt-1">{request.phone || "not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Email</p>
              <p className="mt-1">{request.email || "not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">City</p>
              <p className="mt-1">{request.city || "not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Request type</p>
              <p className="mt-1">{request.request_type.replace("_", " ")}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Address</p>
              <p className="mt-1">{request.address || "not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Install ID</p>
              <p className="mt-1 font-mono">{request.install_id}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Machine hash</p>
              <p className="mt-1 font-mono">{request.machine_hash}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Machine</p>
              <p className="mt-1">{request.machine_name || "not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">App version</p>
              <p className="mt-1">{request.app_version}</p>
            </div>
          </CardContent>
        </Card>

        {request.status === "approved" ? (
          <Card>
            <CardHeader>
              <CardTitle>Linked records</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 text-sm">
              {request.customer_id ? <Link className="font-medium hover:text-accent" href={`/admin/customers/${request.customer_id}`}>Customer</Link> : null}
              {request.license_id ? <Link className="font-medium hover:text-accent" href={`/admin/licenses/${request.license_id}`}>License</Link> : null}
              {request.device_id ? <Link className="font-medium hover:text-accent" href={`/admin/license-devices/${request.device_id}`}>Device</Link> : null}
            </CardContent>
          </Card>
        ) : null}

        {request.status === "pending" ? (
          <Card>
            <CardHeader>
              <CardTitle>Approve and activate</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={approveRequest.bind(null, request.id)} className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="customer_id">Select customer</Label>
                    <select id="customer_id" name="customer_id" className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs">
                      <option value="">Create from request</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="license_id">Select license</Label>
                    <select id="license_id" name="license_id" className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs">
                      <option value="">Create trial license</option>
                      {licenses.map((license) => (
                        <option key={license.id} value={license.id}>
                          {license.client_name} - {license.license_key_preview}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="customer_name">Customer name</Label>
                    <Input id="customer_name" name="customer_name" defaultValue={request.business_name || request.owner_name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="customer_email">Customer email</Label>
                    <Input id="customer_email" name="customer_email" type="email" defaultValue={request.email} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="expires_at">Valid until</Label>
                    <Input id="expires_at" name="expires_at" type="date" defaultValue={defaultExpiry()} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="grace_days">Grace days</Label>
                    <Input id="grace_days" name="grace_days" type="number" min="0" defaultValue={7} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="allowed_channel">Allowed channel</Label>
                    <select id="allowed_channel" name="allowed_channel" defaultValue="stable" className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs">
                      <option value="stable">stable</option>
                      <option value="beta">beta</option>
                      <option value="dev">dev</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" defaultValue={request.notes} />
                </div>
                <Button variant="primary" className="w-fit">
                  Approve request
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {request.status !== "approved" ? (
          <Card>
            <CardHeader>
              <CardTitle>Reject request</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={rejectRequest.bind(null, request.id)} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reject_notes">Notes</Label>
                  <Textarea id="reject_notes" name="notes" defaultValue={request.notes} />
                </div>
                <Button variant="destructive" className="w-fit rounded-full">
                  Reject request
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AdminShell>
  )
}
