import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const url = "https://sparkpair.dev"
  const lastModified = new Date()

  return [
    {
      url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
