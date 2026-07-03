import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { CustomerForm } from "@/components/garmentsos-pro/customer-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveCustomer, type CustomerStatus } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function createCustomer(formData: FormData) {
  "use server"

  const customer = await saveCustomer({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    client_id: String(formData.get("client_id") ?? ""),
    status: String(formData.get("status") ?? "active") as CustomerStatus,
    notes: String(formData.get("notes") ?? ""),
  })

  revalidatePath("/admin/customers")
  redirect(`/admin/customers/${customer.id}`)
}

export default function NewCustomerPage() {
  return (
    <AdminShell title="New Customer" description="Create a customer record for GarmentsOS PRO licensing.">
      <Card>
        <CardHeader>
          <CardTitle>Customer details</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm action={createCustomer} />
        </CardContent>
      </Card>
    </AdminShell>
  )
}
