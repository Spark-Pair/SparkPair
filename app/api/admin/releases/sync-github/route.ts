import { NextResponse } from "next/server"
import { getProductBySlug, isReleaseChannel, upsertSyncedRelease } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function POST(request: Request) {
  const expected = process.env.RELEASE_WEBHOOK_SECRET
  const auth = request.headers.get("authorization") ?? ""

  if (!expected || auth !== `Bearer ${expected}`) {
    return unauthorized()
  }

  const body = await request.json().catch(() => null)
  const app = body?.app ?? body?.product ?? body?.product_slug

  if (!app || !body?.version || !isReleaseChannel(String(body?.channel ?? ""))) {
    return NextResponse.json({ error: "Invalid product, version, or channel" }, { status: 400 })
  }

  const required = ["released_at", "package_file", "package_url", "package_sha256", "setup_url", "notes"]
  const missing = required.filter((field) => typeof body?.[field] !== "string" || !body[field])

  if (missing.length) {
    return NextResponse.json({ error: "Missing required fields", fields: missing }, { status: 400 })
  }

  let release

  try {
    const product = await getProductBySlug(String(app))
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    release = await upsertSyncedRelease({
      app: product.slug,
      version: String(body.version),
      channel: body.channel,
      mandatory: Boolean(body.mandatory),
      released_at: String(body.released_at),
      package_file: String(body.package_file),
      package_url: String(body.package_url),
      package_sha256: String(body.package_sha256),
      setup_url: String(body.setup_url),
      notes: String(body.notes),
    })
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ error: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }

  return NextResponse.json({ release })
}
