import { AdminShell } from "@/components/admin/admin-shell"
import { ProductForm } from "@/components/admin/product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveProductFromForm } from "../actions"

export const dynamic = "force-dynamic"

export default function NewProductPage() {
  return (
    <AdminShell title="New Product" description="Create a product, app, service, or portfolio project.">
      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm action={saveProductFromForm} />
        </CardContent>
      </Card>
    </AdminShell>
  )
}
