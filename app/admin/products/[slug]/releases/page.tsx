import Link from "next/link"
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import { AdminViewEditActions } from "@/components/admin/admin-actions"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableActions, AdminTableCard } from "@/components/admin/admin-table"
import { ChannelBadge } from "@/components/garmentsos-pro/status-badges"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProductBySlug, getReleases } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export default async function ProductReleasesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const releases = await getReleases(product.slug)

  return (
    <AdminShell
      title={`${product.name} Releases`}
      description="Manage release feed entries for this product."
      action={
        <Button asChild variant="primary">
          <Link href={`/admin/products/${product.slug}/releases/new`}>
            <Plus className="h-4 w-4" />
            New release
          </Link>
        </Button>
      }
    >
      <AdminTableCard title="Releases">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="min-w-36 px-5 py-3">Version</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Latest</TableHead>
                <TableHead>Released</TableHead>
                <TableHead className="min-w-56">File</TableHead>
                <TableHead className="px-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releases.map((release) => (
                <TableRow key={release.id} className="hover:bg-muted/25">
                  <TableCell className="px-5 py-4">
                    <Link href={`/admin/products/${product.slug}/releases/${release.id}`} className="font-medium hover:text-accent">
                      {release.version}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ChannelBadge channel={release.channel} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={release.is_published ? "default" : "outline"}>{release.is_published ? "published" : "draft"}</Badge>
                  </TableCell>
                  <TableCell>{release.is_latest ? "yes" : "no"}</TableCell>
                  <TableCell>{new Date(release.released_at).toLocaleDateString("en-US")}</TableCell>
                  <TableCell>{release.package_file}</TableCell>
                  <TableCell className="px-5 py-4">
                    <AdminTableActions>
                      <AdminViewEditActions href={`/admin/products/${product.slug}/releases/${release.id}`} />
                    </AdminTableActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </AdminTableCard>
    </AdminShell>
  )
}
