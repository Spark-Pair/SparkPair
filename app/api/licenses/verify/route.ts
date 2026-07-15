import { NextResponse } from "next/server"
import { verifyLicense } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const product = typeof body?.product === "string" ? body.product : ""
  const client_id = typeof body?.client_id === "string" ? body.client_id : ""
  const license_key = typeof body?.license_key === "string" ? body.license_key : ""
  const install_id = typeof body?.install_id === "string" ? body.install_id : ""
  const machine_hash = typeof body?.machine_hash === "string" ? body.machine_hash : ""
  const app_version = typeof body?.app_version === "string" ? body.app_version : ""
  const previous_machine_hash = typeof body?.previous_machine_hash === "string" ? body.previous_machine_hash : ""
  const previous_machine_hashes = Array.isArray(body?.previous_machine_hashes)
    ? body.previous_machine_hashes.filter((value: unknown): value is string => typeof value === "string")
    : []
  const fingerprint_source = typeof body?.fingerprint_source === "string" ? body.fingerprint_source : ""
  const fingerprint_version = Number(body?.fingerprint_version ?? 0)
  const stable_fingerprint_migration = body?.stable_fingerprint_migration === true
  const rebind_requested = body?.rebind_requested === true
  const fingerprint_rebind_reason =
    typeof body?.fingerprint_rebind_reason === "string" ? body.fingerprint_rebind_reason : ""

  if (!product || !install_id || !app_version) {
    return NextResponse.json(
      { valid: false, status: "invalid", message: "product, install_id, and app_version are required." },
      { status: 400 },
    )
  }

  let result

  try {
    result = await verifyLicense({
      product,
      client_id,
      license_key,
      install_id,
      machine_hash,
      app_version,
      previous_machine_hash,
      previous_machine_hashes,
      fingerprint_source,
      fingerprint_version,
      stable_fingerprint_migration,
      rebind_requested,
      fingerprint_rebind_reason,
    })
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ valid: false, status: "unavailable", message: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }

  return NextResponse.json(result, { status: result.valid ? 200 : 200 })
}
