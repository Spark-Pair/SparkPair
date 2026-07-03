import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { ReleaseForm } from "@/components/garmentsos-pro/release-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveRelease, type ReleaseChannel } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

function boolValue(formData: FormData, key: string) {
  return formData.has(key)
}

async function createRelease(formData: FormData) {
  "use server"

  const release = await saveRelease({
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
  })

  revalidatePath("/admin/products/garmentsos-pro/releases")
  revalidatePath("/downloads/garmentsos-pro")
  redirect(`/admin/products/garmentsos-pro/releases/${release.id}`)
}

export default function NewReleasePage() {
  return (
    <AdminShell title="New Release" description="Create a GarmentsOS PRO release for the public update feed.">
      <Card>
        <CardHeader>
          <CardTitle>Release details</CardTitle>
        </CardHeader>
        <CardContent>
          <ReleaseForm action={createRelease} />
        </CardContent>
      </Card>
    </AdminShell>
  )
}
