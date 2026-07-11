"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, ArrowLeft, BriefcaseBusiness, ClipboardCheck, GalleryVerticalEnd, HardDrive, KeyRound, LogOut, PackageOpen, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminTheme } from "@/components/admin/admin-theme"
import { cn } from "@/lib/utils"

const adminLinks = [
  {
    label: "Products",
    href: "/admin/products",
    icon: BriefcaseBusiness,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: UsersRound,
  },
  {
    label: "Licenses",
    href: "/admin/licenses",
    icon: KeyRound,
  },
  {
    label: "Devices",
    href: "/admin/license-devices",
    icon: HardDrive,
  },
  {
    label: "Activation Requests",
    href: "/admin/activation-requests",
    icon: ClipboardCheck,
  },
  {
    label: "Releases",
    href: "/admin/products/garmentsos-pro/releases",
    icon: PackageOpen,
  },
  {
    label: "Portfolio",
    href: "/admin/portfolio",
    icon: GalleryVerticalEnd,
  },
  {
    label: "Activity",
    href: "/admin/activity",
    icon: Activity,
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
  const pathname = usePathname()

  return (
    <main className={cn("min-h-screen w-full", adminTheme.page, adminTheme.text)}>
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside className={cn("w-full border-b px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[280px] lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r", adminTheme.surface, adminTheme.borderStrong)}>
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex w-fit items-center gap-3">
              <Image src="/images/spark-pair6.png" alt="SparkPair Logo" width={148} height={44} className="h-9 w-auto" />
            </Link>
            <span className={cn("rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em]", adminTheme.primaryText, adminTheme.primarySoft, "border-[#e85f24]/25")}>
              Admin
            </span>
          </div>

          <div className={cn("mt-8 hidden rounded-2xl border p-4 lg:block", adminTheme.border, adminTheme.surfaceSoft)}>
            <p className={cn("text-[10px] font-bold uppercase tracking-[0.3em]", adminTheme.textMuted)}>Control Center</p>
            <p className={cn("mt-2 text-sm leading-relaxed", adminTheme.textMuted)}>
              Products, portfolio projects, customer activations, licenses, and releases.
            </p>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {adminLinks.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href.includes("/products/") && pathname.startsWith("/admin/products/")) ||
                (item.href !== "/admin/products/garmentsos-pro/releases" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:w-full lg:rounded-lg",
                    isActive
                      ? cn("border-[#e85f24]/35 shadow-sm shadow-[#e85f24]/15", adminTheme.primary, adminTheme.primaryHover)
                      : cn("border-transparent hover:bg-[#f1eee9] hover:text-[#171717] hover:border-[#ded8d0]", adminTheme.textMuted),
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className={cn("mt-6 hidden border-t pt-5 lg:mt-auto lg:grid lg:gap-3", adminTheme.border)}>
            <div className={cn("rounded-2xl border p-4", adminTheme.border, adminTheme.surfaceSoft)}>
              <p className={cn("text-xs font-semibold", adminTheme.text)}>SparkPair Admin</p>
              <p className={cn("mt-1 text-xs leading-relaxed", adminTheme.textMuted)}>Protected session active.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
            </Button>
            <form action="/admin/logout" method="post">
              <Button type="submit" variant="outline" className="w-full">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-6 py-8 lg:px-12 lg:py-10">
          <div className={cn("mb-8 flex w-full flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between", adminTheme.border)}>
            <div className="max-w-5xl">
              <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.35em]", adminTheme.primaryText)}>GarmentsOS PRO</p>
              <h1 className={cn("text-4xl font-bold tracking-tight sm:text-5xl", adminTheme.text)}>{title}</h1>
              <p className={cn("mt-3 text-sm leading-relaxed", adminTheme.textMuted)}>{description}</p>
            </div>
            <div className="flex items-center gap-3">
              {action}
              <Button asChild variant="outline" size="sm" className="rounded-full lg:hidden">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Site
                </Link>
              </Button>
              <form action="/admin/logout" method="post" className="lg:hidden">
                <Button type="submit" variant="ghost" size="sm" className="rounded-full">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
          {children}
        </section>
      </div>
    </main>
  )
}
