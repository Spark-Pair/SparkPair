"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const message = "MongoDB connection failed. Check MONGODB_URI, Atlas Network Access, DNS SRV, and port 27017."

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-background px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Admin data unavailable</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button onClick={reset} className="mt-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
          Try again
        </Button>
      </div>
    </main>
  )
}
