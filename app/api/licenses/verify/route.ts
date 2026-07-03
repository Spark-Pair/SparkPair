import { NextResponse } from "next/server"
import { verifyLicense } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const product = typeof body?.product === "string" ? body.product : ""
  const client_id = typeof body?.client_id === "string" ? body.client_id : ""
  const license_key = typeof body?.license_key === "string" ? body.license_key : ""
  const install_id = typeof body?.install_id === "string" ? body.install_id : ""
  const app_version = typeof body?.app_version === "string" ? body.app_version : ""

  if (!product || !client_id || !license_key || !install_id || !app_version) {
    return NextResponse.json(
      { valid: false, status: "invalid", message: "product, client_id, license_key, install_id, and app_version are required." },
      { status: 400 },
    )
  }

  let result

  try {
    result = await verifyLicense({ product, client_id, license_key, install_id, app_version })
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ valid: false, status: "unavailable", message: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }

  return NextResponse.json(result, { status: result.valid ? 200 : 200 })
}
