import { revalidatePath } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { ReleaseForm } from "@/components/garmentsos-pro/release-form"
import { UpdateFeedPreview } from "@/components/garmentsos-pro/update-feed-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRelease, saveRelease, type ReleaseChannel } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

function boolValue(formData: FormData, key: string) {
  return formData.has(key)
}

async function updateRelease(id: string, formData: FormData) {
  "use server"

  await saveRelease(
    {
      version: String(formData.get("version") ?? ""),
      channel: String(formData.get("channel") ?? "stable") as ReleaseChannel,
      mandatory: boolValue(formData, "mandatory"),
      released_at: new Date(String(formData.get("released_at") ?? "")).toISOString(),
      package_file: String(formData.get("package_file") ?? ""),
      package_url: String(formData.get("package_url") ?? ""),
      package_sha256: String(formData.get("package_sha256") ?? ""),
      setup_url: String(formData.get("setup_url") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      is_published: boolValue(formData, "is_published"),
      is_latest: boolValue(formData, "is_latest"),
    },
    id,
  )

  revalidatePath("/admin/products/garmentsos-pro/releases")
  revalidatePath(`/admin/products/garmentsos-pro/releases/${id}`)
  revalidatePath("/downloads/garmentsos-pro")
  redirect(`/admin/products/garmentsos-pro/releases/${id}`)
}

export default async function ReleaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const release = await getRelease(id)

  if (!release) {
    notFound()
  }

  return (
    <AdminShell title={`Release ${release.version}`} description="Edit release metadata and update-feed status.">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Release details</CardTitle>
          </CardHeader>
          <CardContent>
            <ReleaseForm action={updateRelease.bind(null, release.id)} release={release} />
          </CardContent>
        </Card>
        <UpdateFeedPreview release={release} />
      </div>
    </AdminShell>
  )
}
