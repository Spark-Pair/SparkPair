import { createHash } from "crypto"
import type { ProductMedia } from "@/lib/garmentsos-pro"

export type CloudinaryUploadType = "logo" | "hero" | "gallery" | "video"

const imageTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"])
const videoTypes = new Set(["video/mp4", "video/webm"])

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required for Cloudinary uploads.`)
  }
  return value
}

function cleanFolderPart(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function getCloudinaryLimits() {
  return {
    imageMaxBytes: Number(process.env.CLOUDINARY_MAX_IMAGE_MB || 5) * 1024 * 1024,
    videoMaxBytes: Number(process.env.CLOUDINARY_MAX_VIDEO_MB || 50) * 1024 * 1024,
  }
}

export function validateCloudinaryFile(file: File, type: CloudinaryUploadType) {
  const { imageMaxBytes, videoMaxBytes } = getCloudinaryLimits()
  const isVideo = type === "video"
  const allowedTypes = isVideo ? videoTypes : imageTypes
  const maxBytes = isVideo ? videoMaxBytes : imageMaxBytes

  if (!allowedTypes.has(file.type)) {
    return { ok: false, message: isVideo ? "Only mp4 and webm videos are allowed." : "Only jpg, jpeg, png, and webp images are allowed." }
  }

  if (file.size > maxBytes) {
    return { ok: false, message: `File is too large. Max ${Math.round(maxBytes / 1024 / 1024)}MB allowed.` }
  }

  return { ok: true, message: "" }
}

function cloudinarySignature(params: Record<string, string | number>, secret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  return createHash("sha1").update(`${payload}${secret}`).digest("hex")
}

export async function uploadToCloudinary(file: File, productSlug: string, type: CloudinaryUploadType): Promise<ProductMedia> {
  const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME")
  const apiKey = requiredEnv("CLOUDINARY_API_KEY")
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET")
  const baseFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "sparkpair/products"
  const safeSlug = cleanFolderPart(productSlug || "draft-product") || "draft-product"
  const folder = `${baseFolder.replace(/\/+$/g, "")}/${safeSlug}`
  const resourceType = type === "video" ? "video" : "image"
  const timestamp = Math.floor(Date.now() / 1000)
  const params = { folder, timestamp }
  const signature = cloudinarySignature(params, apiSecret)

  const body = new FormData()
  body.set("file", file)
  body.set("api_key", apiKey)
  body.set("timestamp", String(timestamp))
  body.set("folder", folder)
  body.set("signature", signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body,
  })
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.error?.message || "Cloudinary upload failed.")
  }

  return {
    public_id: String(result.public_id),
    secure_url: String(result.secure_url),
    width: Number(result.width || 0),
    height: Number(result.height || 0),
    format: String(result.format || ""),
    resource_type: String(result.resource_type || resourceType),
    alt: "",
    caption: "",
    sort_order: 0,
  }
}

export async function deleteFromCloudinary(publicId: string, resourceType = "image") {
  const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME")
  const apiKey = requiredEnv("CLOUDINARY_API_KEY")
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET")
  const timestamp = Math.floor(Date.now() / 1000)
  const params = { public_id: publicId, timestamp }
  const signature = cloudinarySignature(params, apiSecret)

  const body = new URLSearchParams()
  body.set("public_id", publicId)
  body.set("api_key", apiKey)
  body.set("timestamp", String(timestamp))
  body.set("signature", signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
    method: "POST",
    body,
  })
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.error?.message || "Cloudinary delete failed.")
  }

  return result
}
