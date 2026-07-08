import { NextResponse } from "next/server"
import { getPortfolioProducts } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"

export async function GET() {
  try {
    const products = await getPortfolioProducts()
    return NextResponse.json({
      products: products.map((product) => ({
        id: product.id,
        title: product.name,
        caseStudyDetail: product.description || product.short_description,
        description: product.short_description || product.description,
        technologies: product.tech_stack,
        deliverables: product.tech_stack,
        screenshots: product.gallery_images?.length
          ? product.gallery_images.map((image, index) => ({
              id: image.public_id || `gallery-${index}`,
              title: image.caption || image.alt || `Screenshot ${index + 1}`,
              url: image.secure_url,
            }))
          : product.screenshots,
        video: product.video_url || "",
        image:
          product.hero_image?.secure_url ||
          product.logo_image?.secure_url ||
          product.gallery_images?.[0]?.secure_url ||
          product.hero_image_url ||
          product.logo_url ||
          "/placeholder.jpg",
        link: product.live_url || product.demo_url || product.website_url || (product.public_download_enabled ? `/downloads/${product.slug}` : "#"),
      })),
    })
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ error: mongoConnectionErrorMessage, products: [] }, { status: 503 })
    }
    throw error
  }
}
