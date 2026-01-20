import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/smooth-scroll" // Path check karlein
import "./globals.css"

// Fonts config with CSS variables
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono" 
})

export const metadata: Metadata = {
  title: "SparkPair — Digital Solutions That Ignite Growth",
  description:
    "We craft exceptional digital experiences. Strategy, design, and development for forward-thinking brands.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="selection:bg-accent/20 selection:text-foreground">
      {/* Lenis smooth scroll working ke liye 'font-sans' class yahan add ki hai */}
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <SmoothScroll>
          <main>
            {children}
          </main>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}