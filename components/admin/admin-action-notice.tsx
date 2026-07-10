import { AlertCircle, CheckCircle2 } from "lucide-react"

export function AdminActionNotice({
  status,
  message,
}: {
  status?: string
  message?: string
}) {
  if (!status || !message) {
    return null
  }

  const isError = status === "error"

  return (
    <div
      className={
        isError
          ? "mb-5 flex items-start gap-3 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]"
          : "mb-5 flex items-start gap-3 rounded-2xl border border-[#bbf7d0] bg-[#dcfce7] px-4 py-3 text-sm text-[#166534]"
      }
    >
      {isError ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{message}</span>
    </div>
  )
}
