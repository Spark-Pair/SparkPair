import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProductRelease } from "@/lib/garmentsos-pro"

export function ReleaseForm({
  action,
  release,
}: {
  action: (formData: FormData) => void | Promise<void>
  release?: ProductRelease
}) {
  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="version">Version</Label>
          <Input id="version" name="version" placeholder="1.8.40" defaultValue={release?.version} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="channel">Channel</Label>
          <select
            id="channel"
            name="channel"
            required
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue={release?.channel ?? "stable"}
          >
            <option value="stable">stable</option>
            <option value="beta">beta</option>
            <option value="dev">dev</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="released_at">Released at</Label>
          <Input
            id="released_at"
            name="released_at"
            type="datetime-local"
            defaultValue={release?.released_at ? release.released_at.slice(0, 16) : new Date().toISOString().slice(0, 16)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="package_file">Package file</Label>
          <Input id="package_file" name="package_file" placeholder="garmentsos-pro-1.8.40.zip" defaultValue={release?.package_file} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="package_sha256">Package SHA256</Label>
          <Input id="package_sha256" name="package_sha256" defaultValue={release?.package_sha256} required />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="package_url">Package URL</Label>
        <Input id="package_url" name="package_url" type="url" defaultValue={release?.package_url} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="setup_url">Setup URL</Label>
        <Input id="setup_url" name="setup_url" type="url" placeholder="https://.../GarmentsOS-PRO.exe" defaultValue={release?.setup_url} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" className="min-h-28" defaultValue={release?.notes} required />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="mandatory" defaultChecked={release?.mandatory} />
          Mandatory
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="is_published" defaultChecked={release?.is_published ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="is_latest" defaultChecked={release?.is_latest ?? true} />
          Latest for channel
        </label>
      </div>

      <Button variant="primary" type="submit" className="w-fit">
        {release ? "Save release" : "Create release"}
      </Button>
    </form>
  )
}
