import { Badge } from "@/components/ui/badge"
import type { CustomerStatus, DeviceStatus, LicenseStatus, ReleaseChannel } from "@/lib/garmentsos-pro"

export function ChannelBadge({ channel }: { channel: ReleaseChannel }) {
  const className =
    channel === "stable"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : channel === "beta"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-sky-200 bg-sky-50 text-sky-700"

  return (
    <Badge variant="outline" className={className}>
      {channel}
    </Badge>
  )
}

export function LicenseStatusBadge({ status }: { status: LicenseStatus }) {
  const className =
    status === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "suspended"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-destructive/20 bg-destructive/5 text-destructive"

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  )
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "active"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-muted bg-muted text-muted-foreground"
      }
    >
      {status}
    </Badge>
  )
}

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  const className =
    status === "approved"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "blocked"
        ? "border-destructive/20 bg-destructive/5 text-destructive"
        : "border-amber-200 bg-amber-50 text-amber-700"

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  )
}
