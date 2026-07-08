import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Customer, ProductLicense } from "@/lib/garmentsos-pro"

export function LicenseForm({
  action,
  license,
  customers,
}: {
  action: (formData: FormData) => void | Promise<void>
  license?: ProductLicense
  customers: Customer[]
}) {
  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="customer_id">Customer</Label>
          <select
            id="customer_id"
            name="customer_id"
            required
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue={license?.customer_id ?? customers[0]?.id}
          >
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            required
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue={license?.status ?? "active"}
          >
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="expired">expired</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="client_id">Client ID</Label>
          <Input id="client_id" name="client_id" defaultValue={license?.client_id} placeholder="abc-garments" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client_name">Client name</Label>
          <Input id="client_name" name="client_name" defaultValue={license?.client_name} placeholder="ABC Garments" required />
        </div>
      </div>

      {!license ? (
        <div className="grid gap-2">
          <Label htmlFor="plain_key">License key</Label>
          <Input id="plain_key" name="plain_key" placeholder="Leave blank to generate automatically" />
          <p className="text-xs text-muted-foreground">The full key is shown only once after creation.</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="expires_at">Expires at</Label>
          <Input id="expires_at" name="expires_at" type="date" defaultValue={license?.expires_at} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="grace_days">Grace days</Label>
          <Input id="grace_days" name="grace_days" type="number" min="0" defaultValue={license?.grace_days ?? 7} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="allowed_devices">Allowed devices</Label>
          <Input id="allowed_devices" name="allowed_devices" type="number" min="1" defaultValue={license?.allowed_devices ?? 1} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="allowed_channel">Allowed channel</Label>
          <select
            id="allowed_channel"
            name="allowed_channel"
            required
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue={license?.allowed_channel ?? "stable"}
          >
            <option value="stable">stable</option>
            <option value="beta">beta</option>
            <option value="dev">dev</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="machine_hash">Machine hash</Label>
          <Input id="machine_hash" name="machine_hash" defaultValue={license?.machine_hash} placeholder="Bound from approved device" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="install_id">Install ID</Label>
        <Input id="install_id" name="install_id" defaultValue={license?.install_id} placeholder="Bound on first successful check if empty" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" className="min-h-28" defaultValue={license?.notes} />
      </div>

      <Button variant="primary" type="submit" className="w-fit">
        {license ? "Save license" : "Create license"}
      </Button>
    </form>
  )
}
