import Link from "next/link"
import { Plus } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ChannelBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getReleases } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export default async function GarmentsOsProReleasesAdminPage() {
  const releases = await getReleases()

  return (
    <AdminShell
      title="Releases"
      description="Manage GarmentsOS PRO update feed releases for stable, beta, and dev channels."
      action={
        <Button asChild className="rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/products/garmentsos-pro/releases/new">
            <Plus className="h-4 w-4" />
            New release
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Product releases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Latest</TableHead>
                <TableHead>Released</TableHead>
                <TableHead>File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releases.map((release) => (
                <TableRow key={release.id}>
                  <TableCell>
                    <Link href={`/admin/products/garmentsos-pro/releases/${release.id}`} className="font-medium hover:text-accent">
                      {release.version}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ChannelBadge channel={release.channel} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={release.is_published ? "default" : "outline"}>
                      {release.is_published ? "published" : "draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{release.is_latest ? "yes" : "no"}</TableCell>
                  <TableCell>{new Date(release.released_at).toLocaleDateString("en-US")}</TableCell>
                  <TableCell>{release.package_file}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
