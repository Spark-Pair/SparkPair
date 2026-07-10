"use client"

import type { ReactNode } from "react"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { usePublicPageTransition } from "@/components/public-page-transition"

export function PublicPageShell({ children }: { children: ReactNode }) {
  const { isPageRevealed } = usePublicPageTransition()

  return (
    <main className="min-h-screen bg-background">
      <Navigation show={isPageRevealed} />
      {children}
      <Footer />
    </main>
  )
}
