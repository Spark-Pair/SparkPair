"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { adminActionRedirect } from "@/lib/admin-action-feedback"
import {
  archiveProduct,
  deleteProductIfSafe,
  saveProduct,
  type ProductStatus,
  type ProductType,
  type ProductMedia,
  type ReleaseChannel,
} from "@/lib/garmentsos-pro"

function boolValue(formData: FormData, key: string) {
  return formData.has(key)
}

function parseMedia(value: FormDataEntryValue | null): ProductMedia | null {
  if (!value || typeof value !== "string" || value === "null") return null
  try {
    const media = JSON.parse(value) as ProductMedia
    if (!media?.secure_url) return null
    return media
  } catch {
    return null
  }
}

function parseGallery(value: FormDataEntryValue | null): ProductMedia[] {
  if (!value || typeof value !== "string") return []
  try {
    const images = JSON.parse(value) as ProductMedia[]
    return Array.isArray(images) ? images.filter((image) => image?.secure_url) : []
  } catch {
    return []
  }
}

export async function saveProductFromForm(formData: FormData, slug?: string) {
  const product = await saveProduct(
    {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      type: String(formData.get("type") ?? "portfolio_project") as ProductType,
      status: String(formData.get("status") ?? "draft") as ProductStatus,
      short_description: String(formData.get("short_description") ?? ""),
      description: String(formData.get("description") ?? ""),
      logo_url: String(formData.get("logo_url") ?? ""),
      hero_image_url: String(formData.get("hero_image_url") ?? ""),
      screenshots: parseGallery(formData.get("gallery_images_json")).map((image, index) => ({
        id: image.public_id || `shot-${index}`,
        title: image.caption || image.alt || `Screenshot ${index + 1}`,
        url: image.secure_url,
      })),
      website_url: String(formData.get("website_url") ?? ""),
      live_url: String(formData.get("live_url") ?? ""),
      demo_url: String(formData.get("demo_url") ?? ""),
      video_url: String(formData.get("video_url") ?? ""),
      video_embed_url: String(formData.get("video_embed_url") ?? ""),
      logo_image: parseMedia(formData.get("logo_image_json")),
      hero_image: parseMedia(formData.get("hero_image_json")),
      gallery_images: parseGallery(formData.get("gallery_images_json")),
      download_enabled: boolValue(formData, "public_download_enabled"),
      portfolio_enabled: boolValue(formData, "portfolio_enabled"),
      featured: boolValue(formData, "featured"),
      sort_order: Number(formData.get("sort_order") ?? 100),
      category: String(formData.get("category") ?? ""),
      tech_stack: String(formData.get("tech_stack") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      github_owner: String(formData.get("github_owner") ?? ""),
      github_repo: String(formData.get("github_repo") ?? ""),
      github_branch: String(formData.get("github_branch") ?? "main"),
      release_tag_prefix: String(formData.get("release_tag_prefix") ?? "v"),
      package_asset_pattern: String(formData.get("package_asset_pattern") ?? ""),
      setup_asset_pattern: String(formData.get("setup_asset_pattern") ?? ""),
      default_channel: "stable" as ReleaseChannel,
      update_feed_enabled: boolValue(formData, "update_feed_enabled"),
      public_download_enabled: boolValue(formData, "public_download_enabled"),
    },
    slug,
  )

  revalidatePath("/admin/products")
  revalidatePath("/")
  redirect(`/admin/products/${product.slug}`)
}

export async function updateProductFromForm(slug: string, formData: FormData) {
  return saveProductFromForm(formData, slug)
}

export async function archiveProductAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "")
  await archiveProduct(slug)
  revalidatePath("/admin/products")
  adminActionRedirect("/admin/products", "success", "Product archived.")
}

export async function deleteProductAction(formData: FormData) {
  const result = await deleteProductIfSafe(String(formData.get("slug") ?? ""))
  revalidatePath("/admin/products")
  adminActionRedirect("/admin/products", result.ok ? "success" : "error", result.message)
}
