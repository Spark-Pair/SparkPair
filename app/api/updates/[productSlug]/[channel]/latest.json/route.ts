import { NextResponse } from "next/server"
import { getLatestRelease, getProductBySlug, isReleaseChannel } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"
import { buildGithubReleaseAssetUrl } from "@/lib/release-downloads"

export async function GET(_request: Request, { params }: { params: Promise<{ productSlug: string; channel: string }> }) {
  const { productSlug, channel } = await params

  if (!isReleaseChannel(channel)) {
    return NextResponse.json({ error: "Unknown release channel" }, { status: 404 })
  }

  try {
    const product = await getProductBySlug(productSlug)
    if (!product || !product.update_feed_enabled) {
      return NextResponse.json({ error: "Product update feed not found." }, { status: 404 })
    }

    const release = await getLatestRelease(channel, product.slug)
    if (!release) {
      return NextResponse.json({ error: "No published release found." }, { status: 404 })
    }

    return NextResponse.json(
      {
        app: product.slug,
        version: release.version,
        channel: release.channel,
        mandatory: release.mandatory,
        released_at: release.released_at,
        package_file: release.package_file,
        package_url: buildGithubReleaseAssetUrl(product, release, "package"),
        package_sha256: release.package_sha256,
        setup_url: buildGithubReleaseAssetUrl(product, release, "setup"),
        notes: release.notes,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ error: mongoConnectionErrorMessage }, { status: 503 })
    }
    throw error
  }
}
