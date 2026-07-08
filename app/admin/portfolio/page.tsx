import Link from "next/link"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminTableCard } from "@/components/admin/admin-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProducts } from "@/lib/garmentsos-pro"
import { seedStaticPortfolioAction, updatePortfolioProductAction } from "./actions"

export const dynamic = "force-dynamic"

export default async function PortfolioAdminPage() {
  const products = await getProducts()

  return (
    <AdminShell
      title="Portfolio"
      description="Control which products and projects appear in the public SparkPair portfolio."
      action={
        <form action={seedStaticPortfolioAction}>
          <Button variant="outline" className="rounded-full">
            Import static projects
          </Button>
        </form>
      }
    >
      <AdminTableCard title="Portfolio visibility">
          {products.length ? (
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="min-w-72 px-5 py-3">Project</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Live/demo</TableHead>
                  <TableHead className="px-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/25">
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 overflow-hidden rounded-lg border bg-muted">
                          {product.hero_image?.secure_url || product.logo_image?.secure_url || product.hero_image_url || product.logo_url ? (
                            <img
                              src={product.hero_image?.secure_url || product.logo_image?.secure_url || product.hero_image_url || product.logo_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <Link href={`/admin/products/${product.slug}/edit`} className="font-medium hover:text-accent">
                            {product.name}
                          </Link>
                          <p className="font-mono text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category || "Uncategorized"}</TableCell>
                    <TableCell>
                      <Badge variant={product.portfolio_enabled ? "default" : "outline"}>{product.portfolio_enabled ? "visible" : "hidden"}</Badge>
                    </TableCell>
                    <TableCell>{product.featured ? "yes" : "no"}</TableCell>
                    <TableCell>{product.sort_order}</TableCell>
                    <TableCell>{product.live_url || product.demo_url ? "connected" : "not set"}</TableCell>
                    <TableCell className="px-5 py-4">
                      <form action={updatePortfolioProductAction} className="flex items-center justify-end gap-3">
                        <input type="hidden" name="slug" value={product.slug} />
                        <input type="hidden" name="status" value={product.status} />
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input type="checkbox" name="portfolio_enabled" defaultChecked={product.portfolio_enabled} className="h-4 w-4 accent-[hsl(var(--accent))]" />
                          Visible
                        </label>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-4 w-4 accent-[hsl(var(--accent))]" />
                          Featured
                        </label>
                        <Input name="sort_order" type="number" defaultValue={product.sort_order} className="h-9 w-20" />
                        <Button size="sm" variant="outline" className="rounded-full">
                          Save
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="rounded-full">
                          <Link href={`/admin/products/${product.slug}/edit`}>Edit</Link>
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-5">
              <AdminEmptyState title="No products yet" description="Import the existing static portfolio projects or create products manually, then enable portfolio visibility." />
            </div>
          )}
      </AdminTableCard>
    </AdminShell>
  )
}
