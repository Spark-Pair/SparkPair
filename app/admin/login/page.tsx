import type { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import { AlertCircle, ArrowLeft, LockKeyhole } from "lucide-react"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next } = await searchParams

  if (await isAdminAuthenticated()) {
    redirect(next?.startsWith("/admin") ? next : "/admin/licenses")
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="mb-8 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Image src="/images/spark-pair6.png" alt="SparkPair Logo" width={150} height={45} className="h-9 w-auto" />
          </a>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              Site
            </a>
          </Button>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">SparkPair Admin</p>
            <CardTitle className="text-3xl tracking-tight">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Wrong password</AlertTitle>
                <AlertDescription>Admin panel ke liye sahi password enter karein.</AlertDescription>
              </Alert>
            ) : null}

            <form action="/admin/login/session" method="post" className="space-y-5">
              <input type="hidden" name="next" value={next ?? "/admin/licenses"} />
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
              </div>
              <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Open admin panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
