import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Customer } from "@/lib/garmentsos-pro"

export function CustomerForm({
  action,
  customer,
}: {
  action: (formData: FormData) => void | Promise<void>
  customer?: Customer
}) {
  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Customer name</Label>
          <Input id="name" name="name" defaultValue={customer?.name} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={customer?.email} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="client_id">Client ID</Label>
          <Input id="client_id" name="client_id" defaultValue={customer?.client_id} placeholder="abc-garments" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            required
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue={customer?.status ?? "active"}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" className="min-h-28" defaultValue={customer?.notes} />
      </div>

      <Button variant="primary" type="submit" className="w-fit">
        {customer ? "Save customer" : "Create customer"}
      </Button>
    </form>
  )
}
