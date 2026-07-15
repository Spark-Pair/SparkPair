import { NextResponse } from "next/server"
import { getLatestRelease, getProductBySlug, isReleaseChannel } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"
import { redirectToReleaseAsset, validateProductReleaseDownload } from "@/lib/release-downloads"

export const runtime = "nodejs"

export async function GET(_request: Request, { params }: { params: Promise<{ productSlug: string; channel: string }> }) {
  const { productSlug, channel } = await params

  if (!isReleaseChannel(channel)) {
    return NextResponse.json({ error: "Unknown release channel" }, { status: 404 })
  }

  try {
    const product = await getProductBySlug(productSlug)

    if (!product || product.status !== "active" || (!product.download_enabled && !product.update_feed_enabled)) {
      return NextResponse.json({ error: "Product download was not found." }, { status: 404 })
    }

    const release = await getLatestRelease(channel, product.slug)

    const validationError = validateProductReleaseDownload(product, release)

    if (validationError) {
      return validationError
    }

    if (!product || !release) {
      return NextResponse.json({ error: "Published release was not found." }, { status: 404 })
    }

    return redirectToReleaseAsset(product, release, "setup")
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ error: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }
}
