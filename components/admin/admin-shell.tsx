import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, KeyRound, PackageOpen, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"

const adminLinks = [
  {
    label: "Customers",
    href: "/admin/customers",
    icon: UsersRound,
  },
  {
    label: "Releases",
    href: "/admin/products/garmentsos-pro/releases",
    icon: PackageOpen,
  },
  {
    label: "Licenses",
    href: "/admin/licenses",
    icon: KeyRound,
  },
]

export function AdminShell({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex w-fit items-center gap-3">
              <Image src="/images/spark-pair6.png" alt="SparkPair Logo" width={132} height={40} className="h-8 w-auto" />
              <span className="border-l border-border pl-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Admin
              </span>
            </Link>
            <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Site
              </Link>
            </Button>
          </div>

          <nav className="flex flex-wrap gap-2">
            {adminLinks.map((item) => {
              const Icon = item.icon
              return (
                <Button key={item.href} asChild variant="ghost" size="sm" className="rounded-full">
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-accent">GarmentsOS PRO</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {action}
        </div>
        {children}
      </section>
    </main>
  )
}
