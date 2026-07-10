import { NextResponse } from "next/server"
import { getProductBySlug, getPublishedReleaseByVersion } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"
import { createReleasePackageResponse, validateProductReleaseDownload } from "@/lib/release-downloads"

export const runtime = "nodejs"

export async function GET(_request: Request, { params }: { params: Promise<{ productSlug: string; version: string }> }) {
  const { productSlug, version } = await params

  try {
    const product = await getProductBySlug(productSlug)
    const release = await getPublishedReleaseByVersion(productSlug, version)
    const validationError = validateProductReleaseDownload(product, release)

    if (validationError) {
      return validationError
    }

    if (!product || !release) {
      return NextResponse.json({ error: "Published release was not found." }, { status: 404 })
    }

    return createReleasePackageResponse(product, release)
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ error: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }
}
