import type { ReactNode } from "react"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      {children}
      <Footer />
    </main>
  )
}
