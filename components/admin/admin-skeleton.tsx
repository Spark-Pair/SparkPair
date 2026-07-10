import { AdminShell } from "@/components/admin/admin-shell"
import { AdminTableCard } from "@/components/admin/admin-table"
import { Skeleton } from "@/components/ui/skeleton"

function SkeletonLine({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-4 rounded-full bg-[#e4ddd5] ${className}`} />
}

export function AdminTableSkeleton({
  title = "Loading records",
  rows = 6,
  columns = 6,
}: {
  title?: string
  rows?: number
  columns?: number
}) {
  return (
    <AdminTableCard title={title}>
      <div className="min-w-[980px]">
        <div className="grid border-b border-[#cfc6bc] bg-[#f5f2ee] px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr)) 160px` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <SkeletonLine key={index} className="h-3 w-24" />
          ))}
          <SkeletonLine className="ml-auto h-3 w-20" />
        </div>
        <div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid items-center border-b border-[#ded8d0] px-4 py-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr)) 160px` }}
            >
              {Array.from({ length: columns }).map((__, columnIndex) => (
                <SkeletonLine key={columnIndex} className={columnIndex === 0 ? "h-5 w-36" : "w-24"} />
              ))}
              <div className="flex justify-end gap-2">
                <Skeleton className="h-9 w-9 rounded-full bg-[#e4ddd5]" />
                <Skeleton className="h-9 w-9 rounded-full bg-[#e4ddd5]" />
                <Skeleton className="h-9 w-9 rounded-full bg-[#e4ddd5]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminTableCard>
  )
}

export function AdminListLoading({
  title = "Loading",
  description = "Preparing admin data.",
  tableTitle = "Records",
  columns = 6,
}: {
  title?: string
  description?: string
  tableTitle?: string
  columns?: number
}) {
  return (
    <AdminShell title={title} description={description}>
      <AdminTableSkeleton title={tableTitle} columns={columns} />
    </AdminShell>
  )
}

export function AdminDetailLoading({
  title = "Loading",
  description = "Preparing details.",
}: {
  title?: string
  description?: string
}) {
  return (
    <AdminShell title={title} description={description}>
      <div className="grid gap-8 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-[#cfc6bc] bg-white p-6 shadow-[0_8px_24px_rgba(23,23,23,0.05)]">
            <SkeletonLine className="mb-6 h-5 w-40" />
            <div className="grid gap-4">
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-5/6" />
              <SkeletonLine className="w-2/3" />
              <SkeletonLine className="w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
