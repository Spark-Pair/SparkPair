import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://sparkpair.dev"),
  applicationName: "SparkPair",

  title: {
    default: "SparkPair – Custom Software & Digital Solutions Agency",
    template: "%s | SparkPair",
  },

  description:
    "SparkPair is a Pakistan-based digital solutions agency providing custom web apps, mobile apps, ERP, POS systems, eCommerce platforms, and business automation tailored for growing businesses.",

  keywords: [
    "SparkPair",
    "Spark Pair",
    "sparkpair",
    "spark-pair",
    "spark pair",
    "spark_pair",
    "software house Pakistan",
    "custom software development",
    "web development agency",
    "mobile app development",
    "ERP software",
    "POS system",
    "business automation",
  ],
  authors: [{ name: "SparkPair", url: "https://sparkpair.dev" }],
  creator: "SparkPair",
  publisher: "SparkPair",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "SparkPair – Digital Solutions That Spark Growth",
    description:
      "We build custom web, mobile, ERP, POS and automation solutions for startups and businesses.",
    url: "https://sparkpair.dev",
    siteName: "SparkPair",
    images: [
      {
        url: "/hasan.webp",
        width: 1200,
        height: 630,
        alt: "SparkPair Software Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SparkPair – Custom Software & Digital Solutions Agency",
    description:
      "We build custom web apps, mobile apps, ERP, POS and automation software for growing businesses.",
    images: ["/hasan.webp"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0b",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <SmoothScroll>
          <main>{children}</main>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
