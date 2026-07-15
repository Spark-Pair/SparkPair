import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductRelease } from "@/lib/garmentsos-pro"

export function UpdateFeedPreview({ release }: { release: ProductRelease }) {
  const githubBase = `https://github.com/Spark-Pair/garmentsos-pro/releases/download/v${release.version}`
  const payload = {
    app: "garmentsos-pro",
    version: release.version,
    channel: release.channel,
    mandatory: release.mandatory,
    released_at: release.released_at,
    package_file: release.package_file,
    package_url: `${githubBase}/${release.package_file || `garmentsos-pro-${release.version}.zip`}`,
    package_sha256: release.package_sha256,
    setup_url: `${githubBase}/GarmentsOS-PRO.exe`,
    notes: release.notes,
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Update feed preview</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
