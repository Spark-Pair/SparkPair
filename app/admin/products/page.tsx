import Link from "next/link"
import { Archive, Plus, Trash2 } from "lucide-react"
import { AdminActionItem, AdminRowActions, AdminViewEditActions } from "@/components/admin/admin-actions"
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminActionNotice } from "@/components/admin/admin-action-notice"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableActions, AdminTableCard } from "@/components/admin/admin-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAdminActionNotice } from "@/lib/admin-action-feedback"
import { getLatestRelease, getProducts } from "@/lib/garmentsos-pro"
import { archiveProductAction, deleteProductAction } from "./actions"

export const dynamic = "force-dynamic"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ actionStatus?: string; actionMessage?: string }>
}) {
  const notice = await getAdminActionNotice(searchParams)
  const products = await getProducts()
  const latest = await Promise.all(products.map((product) => getLatestRelease(product.default_channel, product.slug)))

  return (
    <AdminShell
      title="Products"
      description="Manage SparkPair products, portfolio projects, repositories, downloads, and release feeds."
      action={
        <Button asChild variant="primary">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            New product
          </Link>
        </Button>
      }
    >
      <AdminActionNotice status={notice.status} message={notice.message} />
      <AdminTableCard title="Product catalog">
          {products.length ? (
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="min-w-56 px-5 py-3">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-52">Repo</TableHead>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Latest</TableHead>
                  <TableHead className="px-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id} className="hover:bg-muted/25">
                    <TableCell className="px-5 py-4">
                      <Link href={`/admin/products/${product.slug}`} className="font-medium hover:text-accent">
                        {product.name}
                      </Link>
                      <p className="font-mono text-xs text-muted-foreground">{product.slug}</p>
                    </TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "outline"}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>{product.github_owner && product.github_repo ? `${product.github_owner}/${product.github_repo}` : "not connected"}</TableCell>
                    <TableCell>{product.portfolio_enabled ? "visible" : "hidden"}</TableCell>
                    <TableCell>{product.public_download_enabled ? "enabled" : "off"}</TableCell>
                    <TableCell>{latest[index]?.version ?? "none"}</TableCell>
                    <TableCell className="px-5 py-4">
                      <AdminTableActions>
                        <AdminViewEditActions href={`/admin/products/${product.slug}`} editHref={`/admin/products/${product.slug}/edit`} />
                        <AdminRowActions>
                        <form action={archiveProductAction}>
                          <input type="hidden" name="slug" value={product.slug} />
                          <AdminActionItem>
                          <AdminConfirmButton title="Archive product?" description="The product will stay linked to existing releases/licenses/devices but will be hidden from active workflows." confirmLabel="Archive">
                            <Archive className="h-4 w-4" />
                            Archive
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="slug" value={product.slug} />
                          <AdminActionItem>
                          <AdminConfirmButton title="Delete product?" description="Deletion only succeeds when no releases, licenses, or devices are linked." confirmLabel="Delete" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                        </AdminRowActions>
                      </AdminTableActions>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <AdminEmptyState title="No products yet" description="Create your first product to manage releases, downloads, and portfolio visibility." />
          )}
      </AdminTableCard>
    </AdminShell>
  )
}
