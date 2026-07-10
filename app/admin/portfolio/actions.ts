"use server"

import { revalidatePath } from "next/cache"
import { adminActionRedirect } from "@/lib/admin-action-feedback"
import { getProductBySlug, saveProduct, slugifyProduct, type ProductStatus, type ProductType } from "@/lib/garmentsos-pro"
import { projects } from "@/projects"

function boolValue(formData: FormData, key: string) {
  return formData.has(key)
}

export async function updatePortfolioProductAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "")
  const product = await getProductBySlug(slug)
  if (!product) {
    adminActionRedirect("/admin/portfolio", "error", "Product was not found.")
  }

  await saveProduct(
    {
      ...product,
      status: String(formData.get("status") ?? product.status) as ProductStatus,
      type: product.type,
      slug: product.slug,
      portfolio_enabled: boolValue(formData, "portfolio_enabled"),
      featured: boolValue(formData, "featured"),
      sort_order: Number(formData.get("sort_order") ?? product.sort_order),
    },
    product.slug,
  )

  revalidatePath("/admin/portfolio")
  revalidatePath("/")
  adminActionRedirect("/admin/portfolio", "success", "Portfolio settings updated.")
}

export async function seedStaticPortfolioAction() {
  let imported = 0
  for (const project of projects) {
    const slug = slugifyProduct(project.title)
    const existing = await getProductBySlug(slug)

    if (existing) {
      continue
    }

    await saveProduct({
      name: project.title,
      slug,
      type: (project.link && project.link !== "#" ? "web_app" : "portfolio_project") as ProductType,
      status: "active",
      short_description: project.description,
      description: project.caseStudyDetail || project.description,
      logo_url: project.image,
      hero_image_url: project.image,
      screenshots: project.screenshots,
      website_url: project.link !== "#" ? project.link : "",
      live_url: project.link !== "#" ? project.link : "",
      demo_url: "",
      video_url: project.video,
      video_embed_url: "",
      logo_image: null,
      hero_image: null,
      gallery_images: [],
      download_enabled: false,
      portfolio_enabled: true,
      featured: project.id === "02",
      sort_order: Number(project.id) || 100,
      category: "Portfolio Project",
      tech_stack: project.technologies,
      github_owner: "",
      github_repo: "",
      github_branch: "main",
      release_tag_prefix: "v",
      package_asset_pattern: "",
      setup_asset_pattern: "",
      default_channel: "stable",
      update_feed_enabled: false,
      public_download_enabled: false,
    })
    imported += 1
  }

  revalidatePath("/admin/portfolio")
  revalidatePath("/admin/products")
  revalidatePath("/")
  adminActionRedirect("/admin/portfolio", "success", imported ? `Imported ${imported} portfolio projects.` : "Static portfolio projects are already imported.")
}
