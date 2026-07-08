import Link from "next/link"
import type { Metadata } from "next"
import { ArrowDownToLine } from "lucide-react"
import { PublicPageShell } from "@/components/public-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDownloadProducts, getLatestRelease } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download SparkPair products and installers.",
}

export default async function DownloadsPage() {
  const products = await getDownloadProducts()
  const releases = await Promise.all(products.map((product) => getLatestRelease(product.default_channel, product.slug)))

  return (
    <PublicPageShell>
      <section className="px-6 pb-24 pt-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-accent">Downloads</p>
          <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-black sm:text-6xl">Product Downloads</h1>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {products.map((product, index) => (
              <Card key={product.id} className="rounded-2xl">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
                  <p className="text-sm text-muted-foreground">Latest stable: {releases[index]?.version ?? "not published yet"}</p>
                  <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/downloads/${product.slug}`}>
                      <ArrowDownToLine className="h-4 w-4" />
                      View download
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
