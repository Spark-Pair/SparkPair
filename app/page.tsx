import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = {
  title: "Custom Software, ERP, POS & Automation Agency",
  description:
    "SparkPair builds custom web apps, mobile apps, ERP systems, POS software, eCommerce platforms and automation tools for startups and growing businesses.",
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://sparkpair.dev/#organization",
        name: "SparkPair",
        url: "https://sparkpair.dev",
        logo: "https://sparkpair.dev/android-chrome-512x512.png",
        description:
          "SparkPair is a digital solutions agency building custom web apps, mobile apps, ERP, POS and business automation systems.",
        email: "hello@sparkpair.dev",
        telephone: "+92 316 5825495",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Karachi",
          addressCountry: "PK",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://sparkpair.dev/#website",
        url: "https://sparkpair.dev",
        name: "SparkPair",
        publisher: {
          "@id": "https://sparkpair.dev/#organization",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://sparkpair.dev/#service",
        name: "SparkPair",
        url: "https://sparkpair.dev",
        areaServed: "Worldwide",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Karachi",
          addressCountry: "PK",
        },
        serviceType: [
          "Custom Web Application Development",
          "Mobile App Development",
          "ERP Software Development",
          "POS Software Development",
          "Business Automation",
          "eCommerce Development",
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageShell />
    </>
  )
}
