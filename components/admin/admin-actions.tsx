import Link from "next/link"
import type { ReactNode } from "react"
import { Eye, MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { adminTheme } from "@/components/admin/admin-theme"
import { cn } from "@/lib/utils"

export function AdminViewEditActions({ href, editHref }: { href: string; editHref?: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="icon">
        <Link href={href}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon">
        <Link href={editHref || href}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
    </div>
  )
}

export function AdminRowActions({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className={cn("z-100 w-52 rounded-xl border bg-white p-1.5 shadow-lg shadow-black/10", adminTheme.borderStrong)}>
        <div className="grid gap-1">{children}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AdminActionItem({ children }: { children: ReactNode }) {
  return <div className="[&_button]:h-9 [&_button]:w-full [&_button]:justify-start [&_button]:rounded-lg [&_button]:px-3 [&_button]:text-sm">{children}</div>
}
