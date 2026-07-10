"use client"

import { usePublicPageTransition } from "@/components/public-page-transition"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Team } from "@/components/team"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export function PageShell() {
  const { isPageRevealed } = usePublicPageTransition()

  return (
    <main className="min-h-screen bg-background relative">
      <Navigation show={isPageRevealed} />
      <Hero show={isPageRevealed} />
      <Services />
      <Projects />
      <Team />
      <CTA />
      <Footer />
    </main>
  )
}
