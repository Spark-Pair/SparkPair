import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://sparkpair.dev/sitemap.xml",
    host: "https://sparkpair.dev",
  }
}
