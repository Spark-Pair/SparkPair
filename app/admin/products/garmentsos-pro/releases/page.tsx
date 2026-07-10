import Link from "next/link"
import { revalidatePath } from "next/cache"
import { CheckCircle2, EyeOff, Plus, Trash2 } from "lucide-react"
import { AdminActionItem, AdminRowActions, AdminViewEditActions } from "@/components/admin/admin-actions"
import { AdminActionNotice } from "@/components/admin/admin-action-notice"
import { AdminConfirmButton } from "@/components/admin/admin-confirm-button"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableActions, AdminTableCard } from "@/components/admin/admin-table"
import { ChannelBadge } from "@/components/garmentsos-pro/status-badges"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { adminActionRedirect, getAdminActionNotice } from "@/lib/admin-action-feedback"
import { deleteReleaseIfSafe, getReleases, setReleaseLatest, unpublishRelease } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

async function markLatestAction(formData: FormData) {
  "use server"
  await setReleaseLatest(String(formData.get("id") ?? ""))
  revalidatePath("/admin/products/garmentsos-pro/releases")
  revalidatePath("/downloads/garmentsos-pro")
  adminActionRedirect("/admin/products/garmentsos-pro/releases", "success", "Release marked latest.")
}

async function unpublishReleaseAction(formData: FormData) {
  "use server"
  await unpublishRelease(String(formData.get("id") ?? ""))
  revalidatePath("/admin/products/garmentsos-pro/releases")
  revalidatePath("/downloads/garmentsos-pro")
  adminActionRedirect("/admin/products/garmentsos-pro/releases", "success", "Release unpublished.")
}

async function deleteReleaseAction(formData: FormData) {
  "use server"
  const result = await deleteReleaseIfSafe(String(formData.get("id") ?? ""))
  revalidatePath("/admin/products/garmentsos-pro/releases")
  adminActionRedirect("/admin/products/garmentsos-pro/releases", result.ok ? "success" : "error", result.message)
}

export default async function GarmentsOsProReleasesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ actionStatus?: string; actionMessage?: string }>
}) {
  const notice = await getAdminActionNotice(searchParams)
  const releases = await getReleases()

  return (
    <AdminShell
      title="Releases"
      description="Manage GarmentsOS PRO update feed releases for stable, beta, and dev channels."
      action={
        <Button asChild variant="primary">
          <Link href="/admin/products/garmentsos-pro/releases/new">
            <Plus className="h-4 w-4" />
            New release
          </Link>
        </Button>
      }
    >
      <AdminActionNotice status={notice.status} message={notice.message} />
      <AdminTableCard title="Product releases">
          {releases.length ? (
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
                  <TableCell className="px-5 py-4">
                    <AdminTableActions>
                      <AdminViewEditActions href={`/admin/products/garmentsos-pro/releases/${release.id}`} />
                      <AdminRowActions>
                      {!release.is_latest ? (
                        <form action={markLatestAction}>
                          <input type="hidden" name="id" value={release.id} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Mark release as latest?"
                            description="This will publish the release and unset the previous latest release for this channel."
                            confirmLabel="Mark latest"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Latest
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                      ) : null}
                      {release.is_published ? (
                        <form action={unpublishReleaseAction}>
                          <input type="hidden" name="id" value={release.id} />
                          <AdminActionItem>
                          <AdminConfirmButton
                            title="Unpublish release?"
                            description="The release will no longer be returned by the public update feed."
                            confirmLabel="Unpublish"
                          >
                            <EyeOff className="h-4 w-4" />
                            Unpublish
                          </AdminConfirmButton>
                          </AdminActionItem>
                        </form>
                      ) : null}
                      <form action={deleteReleaseAction}>
                        <input type="hidden" name="id" value={release.id} />
                        <AdminActionItem>
                        <AdminConfirmButton
                          title="Delete release?"
                          description="Only draft, non-latest releases can be deleted. Published or latest releases must be unpublished first."
                          confirmLabel="Delete"
                          variant="destructive"
                        >
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
            <AdminEmptyState title="No releases yet" description="Create a stable release or sync one from GitHub before the public feed can return a package." />
          )}
      </AdminTableCard>
    </AdminShell>
  )
}
