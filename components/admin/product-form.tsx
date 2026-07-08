"use client"

import { useState, useTransition } from "react"
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product, ProductMedia } from "@/lib/garmentsos-pro"

type UploadType = "logo" | "hero" | "gallery" | "video"

function fallbackMedia(url: string | undefined, alt: string): ProductMedia | null {
  if (!url) return null
  return {
    public_id: "",
    secure_url: url,
    width: 0,
    height: 0,
    format: "",
    resource_type: "image",
    alt,
    caption: "",
    sort_order: 0,
  }
}

function MediaPreview({
  media,
  label,
  onRemove,
  onAltChange,
  onCaptionChange,
}: {
  media: ProductMedia
  label: string
  onRemove: () => void
  onAltChange: (value: string) => void
  onCaptionChange: (value: string) => void
}) {
  return (
    <div className="grid gap-3 rounded-xl border bg-background p-3">
      <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
        {media.resource_type === "video" ? (
          <video src={media.secure_url} className="h-full w-full object-cover" muted playsInline controls />
        ) : (
          <img src={media.secure_url} alt={media.alt || label} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="grid gap-2">
        <Input value={media.alt} onChange={(event) => onAltChange(event.target.value)} placeholder={`${label} alt text`} />
        <Input value={media.caption} onChange={(event) => onCaptionChange(event.target.value)} placeholder="Caption" />
      </div>
      <Button type="button" variant="outline" size="sm" className="w-fit rounded-full" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
        Remove
      </Button>
    </div>
  )
}

export function ProductForm({
  action,
  product,
}: {
  action: (formData: FormData) => void | Promise<void>
  product?: Product
}) {
  const [logoImage, setLogoImage] = useState<ProductMedia | null>(product?.logo_image || fallbackMedia(product?.logo_url, product?.name || "Product logo"))
  const [heroImage, setHeroImage] = useState<ProductMedia | null>(
    product?.hero_image || fallbackMedia(product?.hero_image_url, product?.name || "Product hero"),
  )
  const [galleryImages, setGalleryImages] = useState<ProductMedia[]>(
    product?.gallery_images?.length
      ? product.gallery_images
      : (product?.screenshots || []).map((item, index) => ({
          public_id: "",
          secure_url: item.url,
          width: 0,
          height: 0,
          format: "",
          resource_type: "image",
          alt: item.title,
          caption: item.title,
          sort_order: index,
        })),
  )
  const [uploading, setUploading] = useState<string>("")
  const [message, setMessage] = useState("")
  const [isSaving, startSaving] = useTransition()

  const uploadFiles = async (files: FileList | null, type: UploadType) => {
    if (!files?.length) return

    setMessage("")
    setUploading(type)
    const productSlug = (document.getElementById("slug") as HTMLInputElement | null)?.value || product?.slug || "draft-product"

    try {
      const uploaded: ProductMedia[] = []
      for (const file of Array.from(files)) {
        const body = new FormData()
        body.set("file", file)
        body.set("type", type)
        body.set("productSlug", productSlug)

        const response = await fetch("/api/admin/uploads/cloudinary", {
          method: "POST",
          body,
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Upload failed.")
        }

        uploaded.push(result.media)
      }

      if (type === "logo") setLogoImage({ ...uploaded[0], alt: uploaded[0].alt || `${product?.name || "Product"} logo` })
      if (type === "hero") setHeroImage({ ...uploaded[0], alt: uploaded[0].alt || `${product?.name || "Product"} hero image` })
      if (type === "gallery") {
        setGalleryImages((current) => [
          ...current,
          ...uploaded.map((item, index) => ({ ...item, sort_order: current.length + index })),
        ])
      }
      setMessage("Upload complete. Save the product to keep these media changes.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setUploading("")
    }
  }

  const removeCloudinaryMedia = async (media: ProductMedia, applyRemove: () => void) => {
    if (media.public_id && !confirm("Delete this media from Cloudinary?")) return

    try {
      if (media.public_id) {
        const response = await fetch("/api/admin/uploads/cloudinary", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: media.public_id, resource_type: media.resource_type }),
        })
        if (!response.ok) {
          const result = await response.json().catch(() => null)
          throw new Error(result?.error || "Cloudinary delete failed.")
        }
      }
      applyRemove()
      setMessage("Media removed. Save the product to keep this change.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Media delete failed.")
    }
  }

  const updateGallery = (index: number, patch: Partial<ProductMedia>) => {
    setGalleryImages((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  const moveGallery = (index: number, direction: -1 | 1) => {
    setGalleryImages((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return next.map((image, sort_order) => ({ ...image, sort_order }))
    })
  }

  return (
    <form
      action={(formData) => {
        setMessage("")
        startSaving(async () => {
          try {
            await action(formData)
          } catch (error) {
            if (error instanceof Error && "digest" in error && String((error as Error & { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
              throw error
            }
            console.error("Product save failed after media changes:", error)
            setMessage("Product save failed. Uploaded media was not lost, but the product document was not updated.")
          }
        })
      }}
      className="grid gap-5"
    >
      <input type="hidden" name="logo_image_json" value={JSON.stringify(logoImage)} />
      <input type="hidden" name="hero_image_json" value={JSON.stringify(heroImage)} />
      <input type="hidden" name="gallery_images_json" value={JSON.stringify(galleryImages)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="garmentsos-pro" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <select id="type" name="type" defaultValue={product?.type ?? "portfolio_project"} className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs">
            <option value="desktop_app">desktop_app</option>
            <option value="web_app">web_app</option>
            <option value="saas">saas</option>
            <option value="portfolio_project">portfolio_project</option>
            <option value="service">service</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue={product?.status ?? "draft"} className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input id="sort_order" name="sort_order" type="number" defaultValue={product?.sort_order ?? 100} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="short_description">Short description</Label>
        <Input id="short_description" name="short_description" defaultValue={product?.short_description} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" className="min-h-28" defaultValue={product?.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={product?.category} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tech_stack">Tech stack</Label>
          <Input id="tech_stack" name="tech_stack" defaultValue={product?.tech_stack?.join(", ")} placeholder="Next.js, Laravel" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" name="website_url" defaultValue={product?.website_url} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="live_url">Live URL</Label>
          <Input id="live_url" name="live_url" defaultValue={product?.live_url} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="demo_url">Demo URL</Label>
          <Input id="demo_url" name="demo_url" defaultValue={product?.demo_url} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="video_url">Video URL</Label>
          <Input id="video_url" name="video_url" defaultValue={product?.video_url} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="video_embed_url">Video embed URL</Label>
        <Input id="video_embed_url" name="video_embed_url" defaultValue={product?.video_embed_url} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="logo_url">Fallback logo/image URL</Label>
          <Input id="logo_url" name="logo_url" defaultValue={product?.logo_url} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hero_image_url">Fallback hero image URL</Label>
          <Input id="hero_image_url" name="hero_image_url" defaultValue={product?.hero_image_url} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <Label>Logo upload</Label>
            <Button type="button" variant="outline" size="sm" className="relative rounded-full" disabled={uploading === "logo"}>
              {uploading === "logo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="absolute inset-0 cursor-pointer opacity-0" onChange={(event) => uploadFiles(event.target.files, "logo")} />
            </Button>
          </div>
          {logoImage ? (
            <MediaPreview
              media={logoImage}
              label="Logo"
              onRemove={() => removeCloudinaryMedia(logoImage, () => setLogoImage(null))}
              onAltChange={(alt) => setLogoImage((current) => (current ? { ...current, alt } : current))}
              onCaptionChange={(caption) => setLogoImage((current) => (current ? { ...current, caption } : current))}
            />
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No logo uploaded.</div>
          )}
        </div>

        <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <Label>Hero upload</Label>
            <Button type="button" variant="outline" size="sm" className="relative rounded-full" disabled={uploading === "hero"}>
              {uploading === "hero" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="absolute inset-0 cursor-pointer opacity-0" onChange={(event) => uploadFiles(event.target.files, "hero")} />
            </Button>
          </div>
          {heroImage ? (
            <MediaPreview
              media={heroImage}
              label="Hero"
              onRemove={() => removeCloudinaryMedia(heroImage, () => setHeroImage(null))}
              onAltChange={(alt) => setHeroImage((current) => (current ? { ...current, alt } : current))}
              onCaptionChange={(caption) => setHeroImage((current) => (current ? { ...current, caption } : current))}
            />
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No hero image uploaded.</div>
          )}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Label>Gallery screenshots</Label>
            <p className="mt-1 text-xs text-muted-foreground">Upload multiple screenshots, then save the product.</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="relative rounded-full" disabled={uploading === "gallery"}>
            {uploading === "gallery" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Add screenshots
            <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" className="absolute inset-0 cursor-pointer opacity-0" onChange={(event) => uploadFiles(event.target.files, "gallery")} />
          </Button>
        </div>
        {galleryImages.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {galleryImages.map((media, index) => (
              <div key={`${media.public_id || media.secure_url}-${index}`} className="grid gap-3 rounded-xl border bg-background p-3">
                <MediaPreview
                  media={media}
                  label={`Screenshot ${index + 1}`}
                  onRemove={() => removeCloudinaryMedia(media, () => setGalleryImages((current) => current.filter((_, itemIndex) => itemIndex !== index)))}
                  onAltChange={(alt) => updateGallery(index, { alt })}
                  onCaptionChange={(caption) => updateGallery(index, { caption })}
                />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => moveGallery(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => moveGallery(index, 1)} disabled={index === galleryImages.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No screenshots uploaded.</div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="github_owner">GitHub owner</Label>
          <Input id="github_owner" name="github_owner" defaultValue={product?.github_owner} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="github_repo">GitHub repo</Label>
          <Input id="github_repo" name="github_repo" defaultValue={product?.github_repo} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="github_branch">GitHub branch</Label>
          <Input id="github_branch" name="github_branch" defaultValue={product?.github_branch ?? "main"} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="release_tag_prefix">Tag prefix</Label>
          <Input id="release_tag_prefix" name="release_tag_prefix" defaultValue={product?.release_tag_prefix ?? "v"} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="package_asset_pattern">Package pattern</Label>
          <Input id="package_asset_pattern" name="package_asset_pattern" defaultValue={product?.package_asset_pattern} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="setup_asset_pattern">Setup pattern</Label>
          <Input id="setup_asset_pattern" name="setup_asset_pattern" defaultValue={product?.setup_asset_pattern} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="portfolio_enabled" defaultChecked={product?.portfolio_enabled} />
          Portfolio
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="featured" defaultChecked={product?.featured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="public_download_enabled" defaultChecked={product?.public_download_enabled} />
          Public downloads
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="update_feed_enabled" defaultChecked={product?.update_feed_enabled} />
          Update feed
        </label>
      </div>

      {message ? (
        <p className="rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">{message}</p>
      ) : null}

      <Button disabled={isSaving || Boolean(uploading)} variant="primary" className="w-fit">
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {product ? "Save product" : "Create product"}
      </Button>
    </form>
  )
}
