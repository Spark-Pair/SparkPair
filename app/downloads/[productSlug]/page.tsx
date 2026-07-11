import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowDownToLine, CheckCircle2, ExternalLink, PlayCircle } from "lucide-react"
import { PublicPageShell } from "@/components/public-page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestRelease, getProductBySlug } from "@/lib/garmentsos-pro"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ productSlug: string }> }): Promise<Metadata> {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug).catch(() => null)
  return {
    title: product ? `${product.name} Download` : "Download",
    description: product?.short_description,
  }
}

export default async function ProductDownloadPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug)
  if (!product || !product.public_download_enabled) notFound()
  const release = await getLatestRelease("stable", product.slug)
  const heroImage = product.hero_image?.secure_url || product.hero_image_url
  const galleryImages = product.gallery_images?.length
    ? product.gallery_images
    : product.screenshots.map((screenshot, index) => ({
        public_id: screenshot.id,
        secure_url: screenshot.url,
        width: 0,
        height: 0,
        format: "",
        resource_type: "image",
        alt: screenshot.title,
        caption: screenshot.title,
        sort_order: index,
      }))
  const actionUrl = product.demo_url || product.live_url || product.website_url
  const setupDownloadUrl = `/api/downloads/${product.slug}/latest/stable/setup`

  return (
    <PublicPageShell>
      <section className="relative overflow-hidden bg-[#fcfcfc] px-6 pb-24 pt-32 lg:px-8">
        <div className="absolute left-1/3 top-32 h-[420px] w-[420px] rounded-full bg-accent/[0.03] blur-[100px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-accent">Product Download</p>
            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-black sm:text-6xl lg:text-7xl">{product.name}</h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-gray-600">
              {product.short_description || product.description}
            </p>
            <p className="mt-5 text-sm font-medium text-muted-foreground">Current stable version: {release?.version ?? "not published yet"}</p>
          </div>
          {heroImage ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-[0_0px_25px_rgba(0,0,0,0.1)]">
              <Image src={heroImage} alt={`${product.name} interface`} fill priority sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{release ? `${product.name} ${release.version}` : "No stable release is published yet."}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {release ? (
                <>
                  <p className="text-sm leading-relaxed text-muted-foreground">{release.notes}</p>
                  {release ? (
                    <Button asChild size="lg" className="h-12 rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent/90">
                      <a href={setupDownloadUrl}>
                        <ArrowDownToLine className="h-4 w-4" />
                        Download Installer
                      </a>
                    </Button>
                  ) : null}
                  {actionUrl ? (
                    <Button asChild variant="outline" className="mx-2 rounded-full px-7 text-accent hover:bg-accent/10">
                      <Link href={actionUrl} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        Live demo
                      </Link>
                    </Button>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No stable release is published yet.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-8">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Install notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {["Windows 10/11 where applicable", "Internet required for first install/update", "License approval may be required for desktop apps"].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Need help? Contact SparkPair at <a className="font-medium text-accent" href="mailto:hello@sparkpair.dev">hello@sparkpair.dev</a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {product.video_url || product.video_embed_url || galleryImages.length ? (
        <section className="bg-[#fcfcfc] px-6 py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8">
            {product.video_embed_url || product.video_url ? (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-accent" />
                    Demo video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.video_embed_url ? (
                    <div className="aspect-video overflow-hidden rounded-xl border bg-black">
                      <iframe src={product.video_embed_url} title={`${product.name} demo video`} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                    </div>
                  ) : (
                    <div className="aspect-video overflow-hidden rounded-xl border bg-black">
                      <video src={product.video_url} className="h-full w-full" controls />
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {galleryImages.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <div key={image.public_id || image.secure_url} className="overflow-hidden rounded-2xl border bg-background">
                    <div className="relative aspect-video bg-muted">
                      <Image src={image.secure_url} alt={image.alt || `${product.name} screenshot ${index + 1}`} fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" />
                    </div>
                    {image.caption ? <p className="px-4 py-3 text-sm text-muted-foreground">{image.caption}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </PublicPageShell>
  )
}
