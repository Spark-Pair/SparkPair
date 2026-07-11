import Link from "next/link"
import { ArrowDownToLine, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductRelease } from "@/lib/garmentsos-pro"
import { ChannelBadge } from "./status-badges"

export function DownloadPanel({ release }: { release: ProductRelease }) {
  return (
    <Card className="rounded-2xl border-border/70 bg-white/80 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-2xl">GarmentsOS PRO {release.version}</CardTitle>
          <ChannelBadge channel={release.channel} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed text-muted-foreground">{release.notes}</p>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Version</p>
            <p className="mt-1 font-medium">{release.version}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">File</p>
            <p className="mt-1 font-medium">GarmentsOS-PRO.exe</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">SHA256</p>
            <p className="mt-1 font-medium">{release.package_sha256.slice(0, 12)}...</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/60">Published</p>
            <p className="mt-1 font-medium">{new Date(release.released_at).toLocaleDateString("en-US")}</p>
          </div>
        </div>
        <Button asChild size="lg" className="h-12 rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent/90">
          <a href={`/api/downloads/${release.product_slug}/latest/${release.channel}/setup`}>
            <ArrowDownToLine className="h-4 w-4" />
            Download for Windows
          </a>
        </Button>
        <Button asChild variant="link" className="h-auto p-0 text-muted-foreground">
          <Link href="/api/updates/garmentsos-pro/stable/latest.json">
            View update feed
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
