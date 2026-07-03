import { NextResponse } from "next/server"
import { registerInstall } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"

function getIpAddress(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    ""
  )
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const product = typeof body?.product === "string" ? body.product : ""
  const install_id = typeof body?.install_id === "string" ? body.install_id : ""
  const machine_hash = typeof body?.machine_hash === "string" ? body.machine_hash : ""
  const machine_name = typeof body?.machine_name === "string" ? body.machine_name : ""
  const app_version = typeof body?.app_version === "string" ? body.app_version : ""

  if (!product || !install_id || !app_version) {
    return NextResponse.json(
      { registered: false, status: "invalid", message: "product, install_id, and app_version are required." },
      { status: 400 },
    )
  }

  try {
    const result = await registerInstall({
      product,
      install_id,
      machine_hash,
      machine_name,
      app_version,
      ip_address: getIpAddress(request),
      user_agent: request.headers.get("user-agent") ?? "",
    })

    return NextResponse.json(result)
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ registered: false, status: "unavailable", message: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }
}
