import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestRelease, getLicenses, getLicenseDevices, getProductBySlug } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [latest, licenses, devices] = await Promise.all([
    getLatestRelease(product.default_channel, product.slug),
    getLicenses(),
    getLicenseDevices(),
  ])
  const productLicenses = licenses.filter((license) => license.product_key === product.product_key)
  const productDevices = devices.filter((device) => device.product_key === product.product_key)

  return (
    <AdminShell
      title={product.name}
      description={product.short_description || "Product configuration, repository connection, releases, downloads, and visibility."}
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/admin/products/${product.slug}/edit`}>Edit</Link>
          </Button>
          <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={`/admin/products/${product.slug}/releases`}>Releases</Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p><span className="text-muted-foreground">Slug:</span> <span className="font-mono">{product.slug}</span></p>
            <p><span className="text-muted-foreground">Type:</span> {product.type}</p>
            <p><span className="text-muted-foreground">Category:</span> {product.category || "not set"}</p>
            <p><span className="text-muted-foreground">Status:</span> <Badge variant={product.status === "active" ? "default" : "outline"}>{product.status}</Badge></p>
            <p><span className="text-muted-foreground">Portfolio:</span> {product.portfolio_enabled ? "visible" : "hidden"}</p>
            <p><span className="text-muted-foreground">Downloads:</span> {product.public_download_enabled ? "enabled" : "off"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repository and release feed</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p><span className="text-muted-foreground">Repository:</span> {product.github_owner && product.github_repo ? `${product.github_owner}/${product.github_repo}` : "not connected"}</p>
            <p><span className="text-muted-foreground">Branch:</span> {product.github_branch || "not set"}</p>
            <p><span className="text-muted-foreground">Latest:</span> {latest?.version ?? "none"}</p>
            <p><span className="text-muted-foreground">Download URL:</span> {product.public_download_enabled ? `/downloads/${product.slug}` : "disabled"}</p>
            <p><span className="text-muted-foreground">Feed URL:</span> {product.update_feed_enabled ? `/api/updates/${product.slug}/${product.default_channel}/latest.json` : "disabled"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked licensing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p><span className="text-muted-foreground">Licenses:</span> {productLicenses.length}</p>
            <p><span className="text-muted-foreground">Devices:</span> {productDevices.length}</p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
