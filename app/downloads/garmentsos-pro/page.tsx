import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { DownloadPanel } from "@/components/garmentsos-pro/download-panel"
import { PublicPageShell } from "@/components/public-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestRelease } from "@/lib/garmentsos-pro"

export const metadata: Metadata = {
  title: "GarmentsOS PRO Download",
  description: "Download GarmentsOS PRO for garment factories and view the latest stable update.",
  alternates: {
    canonical: "/downloads/garmentsos-pro",
  },
}

export const dynamic = "force-dynamic"

const requirements = [
  "Windows 10 or Windows 11, 64-bit",
  "Docker Desktop required",
  "Internet required for first install/update",
  "Local backups recommended for production data",
]

const installSteps = [
  "Download the latest stable installer.",
  "Run the setup file as an administrator on the target workstation.",
  "Open GarmentsOS PRO so the app can register this device automatically.",
  "Wait for SparkPair admin approval before production use.",
  "Configure Docker Desktop, users, and backup settings before production use.",
]

export default async function GarmentsOsProDownloadPage() {
  const release = await getLatestRelease("stable")

  if (!release) {
    return (
      <PublicPageShell>
        <section className="px-6 pb-24 pt-32 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm text-muted-foreground">No stable release is published yet.</p>
          </div>
        </section>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell>
      <section className="relative overflow-hidden bg-[#fcfcfc] px-6 pb-24 pt-32 lg:px-8">
        <div className="absolute left-1/3 top-32 h-[420px] w-[420px] rounded-full bg-accent/[0.03] blur-[100px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-accent">Product Download</p>
            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-black sm:text-6xl lg:text-7xl">
              GarmentsOS PRO
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-gray-600">
              A full-featured ERP for garment factories, built for production, inventory, billing, and workforce
              management with dependable local data handling.
            </p>
            <p className="mt-5 text-sm font-medium text-muted-foreground">Current stable version: {release.version}</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-[0_0px_25px_rgba(0,0,0,0.1)]">
            <Image
              src="/images/garmentsos-pro/garmentsos-pro.webp"
              alt="GarmentsOS PRO interface"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <DownloadPanel release={release} />

          <div className="grid gap-8">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>System requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((item) => (
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
                <CardTitle>Install steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {installSteps.map((item, index) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{item}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Need installation or license help? Contact SparkPair at{" "}
                  <a className="font-medium text-accent" href="mailto:hello@sparkpair.dev">
                    hello@sparkpair.dev
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
