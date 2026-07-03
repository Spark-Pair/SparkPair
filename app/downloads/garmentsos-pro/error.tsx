"use client"

import { AlertTriangle } from "lucide-react"
import { PublicPageShell } from "@/components/public-page-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const message = "MongoDB connection failed. Check MONGODB_URI, Atlas Network Access, DNS SRV, and port 27017."

export default function GarmentsOsProDownloadError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicPageShell>
      <section className="px-6 pb-24 pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Download data unavailable</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <Button onClick={reset} className="mt-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            Try again
          </Button>
        </div>
      </section>
    </PublicPageShell>
  )
}
