import { NextResponse } from "next/server"
import { getLatestRelease, getProductBySlug, isReleaseChannel } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"
import { buildGithubReleaseAssetUrl } from "@/lib/release-downloads"

export async function GET(_request: Request, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params

  if (!isReleaseChannel(channel)) {
    return NextResponse.json({ error: "Unknown release channel" }, { status: 404 })
  }

  let release
  let product

  try {
    release = await getLatestRelease(channel)
    product = await getProductBySlug("garmentsos-pro")
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ error: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }

  if (!release) {
    return NextResponse.json({ error: "No published release found." }, { status: 404 })
  }

  if (!product) {
    return NextResponse.json({ error: "Product update feed not found." }, { status: 404 })
  }

  const required = [
    release.version,
    release.channel,
    release.released_at,
    release.package_file,
    release.package_sha256,
  ]

  if (required.some((value) => !value)) {
    return NextResponse.json({ error: "Latest release is missing required feed fields" }, { status: 500 })
  }

  return NextResponse.json(
    {
      app: "garmentsos-pro",
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
}
