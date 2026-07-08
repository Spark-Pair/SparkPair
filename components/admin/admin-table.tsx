import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adminTheme } from "@/components/admin/admin-theme"
import { cn } from "@/lib/utils"

export function AdminTableCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Card className={cn("w-full max-w-none overflow-hidden rounded-2xl p-0 gap-0 border shadow-[0_8px_24px_rgba(23,23,23,0.05)]", adminTheme.surface, adminTheme.borderStrong)}>
      <CardHeader className={cn("border-b px-5 py-4 gap-0", adminTheme.border, adminTheme.surfaceMuted)}>
        <CardTitle className={cn("text-base font-semibold tracking-tight", adminTheme.text)}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto [&_table]:w-full [&_table]:min-w-[980px] [&_thead]:border-b [&_thead]:border-[#cfc6bc] [&_thead]:bg-[#f5f2ee] [&_tbody_tr]:border-[#ded8d0] [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-[#f7f3ef] [&_td]:px-4 [&_td]:py-4 [&_td]:align-middle [&_th]:h-11 [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.14em] [&_th]:text-[#65605a]">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminTableActions({ children }: { children: ReactNode }) {
  return <div className="flex min-w-36 items-center justify-end gap-2">{children}</div>
}
