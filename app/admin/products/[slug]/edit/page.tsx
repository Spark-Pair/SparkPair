import { notFound } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { ProductForm } from "@/components/admin/product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProductBySlug } from "@/lib/garmentsos-pro"
import { updateProductFromForm } from "../../actions"

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <AdminShell title={`Edit ${product.name}`} description="Update product metadata, portfolio visibility, download settings, and repository connection.">
      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm action={updateProductFromForm.bind(null, product.slug)} product={product} />
        </CardContent>
      </Card>
    </AdminShell>
  )
}
