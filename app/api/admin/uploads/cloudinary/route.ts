import { NextResponse } from "next/server"
import { getAdminTokenFromCookieHeader, isAdminAuthenticated } from "@/lib/admin-auth"
import { deleteFromCloudinary, uploadToCloudinary, validateCloudinaryFile, type CloudinaryUploadType } from "@/lib/cloudinary"

export const runtime = "nodejs"

const uploadTypes = new Set(["logo", "hero", "gallery", "video"])

async function isAdminRequest(request: Request) {
  return isAdminAuthenticated(getAdminTokenFromCookieHeader(request.headers.get("cookie")))
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  const file = formData?.get("file")
  const productSlug = String(formData?.get("productSlug") || "draft-product")
  const type = String(formData?.get("type") || "gallery") as CloudinaryUploadType

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required." }, { status: 400 })
  }

  if (!uploadTypes.has(type)) {
    return NextResponse.json({ error: "Invalid upload type." }, { status: 400 })
  }

  const validation = validateCloudinaryFile(file, type)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 })
  }

  try {
    const media = await uploadToCloudinary(file, productSlug, type)
    return NextResponse.json({ media })
  } catch (error) {
    console.error("Cloudinary upload failed:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Cloudinary upload failed." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const publicId = typeof body?.public_id === "string" ? body.public_id : ""
  const resourceType = typeof body?.resource_type === "string" ? body.resource_type : "image"

  if (!publicId || publicId.includes("..")) {
    return NextResponse.json({ error: "Valid public_id is required." }, { status: 400 })
  }

  try {
    await deleteFromCloudinary(publicId, resourceType === "video" ? "video" : "image")
    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error("Cloudinary delete failed:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Cloudinary delete failed." }, { status: 500 })
  }
}
