import { NextResponse } from "next/server"
import { createActivationRequest, type ActivationRequestType } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"

function cleanString(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const product = cleanString(body?.product || body?.product_slug)
  const request_type = cleanString(body?.request_type) as ActivationRequestType
  const install_id = cleanString(body?.install_id)
  const machine_hash = cleanString(body?.machine_hash)
  const app_version = cleanString(body?.app_version)

  if (!product || !install_id || !machine_hash || !app_version) {
    return NextResponse.json(
      { registered: false, status: "invalid", message: "product, install_id, machine_hash, and app_version are required." },
      { status: 400 },
    )
  }

  if (!["demo_trial", "paid_activation"].includes(request_type)) {
    return NextResponse.json({ registered: false, status: "invalid", message: "Invalid request_type." }, { status: 400 })
  }

  try {
    const result = await createActivationRequest({
      product,
      request_type,
      business_name: cleanString(body?.business_name),
      owner_name: cleanString(body?.owner_name),
      phone: cleanString(body?.phone, 80),
      email: cleanString(body?.email, 120),
      city: cleanString(body?.city, 120),
      address: cleanString(body?.address, 1000),
      install_id,
      machine_hash,
      machine_name: cleanString(body?.machine_name, 160),
      app_version,
    })

    return NextResponse.json(result, { status: result.ok ? 200 : 400 })
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ registered: false, status: "unavailable", message: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }
}
