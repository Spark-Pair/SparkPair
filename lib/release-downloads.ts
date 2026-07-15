import { NextResponse } from "next/server"
import type { Product, ProductRelease } from "@/lib/garmentsos-pro"

const githubReleaseAssetUrlPattern =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/i

const largeBinaryProxyLimitMb = 20
const defaultGithubOwner = "Spark-Pair"
const defaultGithubRepo = "garmentsos-pro"

type ReleaseAssetKind = "package" | "setup"

type GithubAssetReference = {
  owner: string
  repo: string
  tag: string
  asset: string
}

function jsonError(error: string, status: number, details?: Record<string, string>) {
  return NextResponse.json(details ? { error, ...details } : { error }, { status })
}

function parseGithubReleaseAssetUrl(value: string): GithubAssetReference | null {
  const match = value.match(githubReleaseAssetUrlPattern)
  if (!match) return null

  return {
    owner: decodeURIComponent(match[1]),
    repo: decodeURIComponent(match[2]),
    tag: decodeURIComponent(match[3]),
    asset: decodeURIComponent(match[4]),
  }
}

function githubReleaseUrl(reference: GithubAssetReference) {
  return `https://github.com/${encodeURIComponent(reference.owner)}/${encodeURIComponent(reference.repo)}/releases/download/${encodeURIComponent(reference.tag)}/${encodeURIComponent(reference.asset)}`
}

function releaseTag(product: Product, release: ProductRelease) {
  return release.github_tag || `${product.release_tag_prefix || "v"}${release.version}`
}

function normalizeGarmentsOsGithubReference(product: Product, release: ProductRelease, kind: ReleaseAssetKind): GithubAssetReference {
  const asset =
    kind === "setup"
      ? product.setup_asset_pattern || "GarmentsOS-PRO.exe"
      : release.github_asset || release.package_file || `garmentsos-pro-${release.version}.zip`

  return {
    // GarmentsOS PRO releases are public now. Keep downloads direct to GitHub to avoid Vercel Fast Origin Transfer.
    owner: product.product_key === "garmentsos-pro" ? defaultGithubOwner : release.github_owner || product.github_owner || defaultGithubOwner,
    repo: product.product_key === "garmentsos-pro" ? defaultGithubRepo : release.github_repo || product.github_repo || defaultGithubRepo,
    tag: releaseTag(product, release),
    asset,
  }
}

export function buildGithubReleaseAssetUrl(product: Product, release: ProductRelease, kind: ReleaseAssetKind) {
  const storedUrl = kind === "setup" ? release.setup_url : release.package_url
  const parsedStoredUrl = storedUrl ? parseGithubReleaseAssetUrl(storedUrl) : null

  if (parsedStoredUrl && product.product_key !== "garmentsos-pro") {
    return githubReleaseUrl(parsedStoredUrl)
  }

  return githubReleaseUrl(normalizeGarmentsOsGithubReference(product, release, kind))
}

export function validateProductReleaseDownload(product: Product | null, release: ProductRelease | null) {
  if (!product) {
    return jsonError("Product download was not found.", 404)
  }

  if (product.status !== "active" || (!product.download_enabled && !product.update_feed_enabled)) {
    return jsonError("Product downloads are not enabled.", 404)
  }

  if (!release) {
    return jsonError("Published release was not found.", 404)
  }

  if (!release.is_published) {
    return jsonError("Release is unpublished.", 404)
  }

  if (!release.package_sha256) {
    return jsonError("Release package SHA256 is not configured.", 500)
  }

  return null
}

export function redirectToReleaseAsset(product: Product, release: ProductRelease, kind: ReleaseAssetKind) {
  const target = buildGithubReleaseAssetUrl(product, release, kind)
  const targetDomain = new URL(target).hostname

  // Guardrail: do not proxy large release binaries through Vercel. These routes only return a tiny 302.
  console.info("Release binary route requested; redirecting without proxying bytes.", {
    product: product.slug,
    version: release.version,
    channel: release.channel,
    kind,
    redirect_target_domain: targetDomain,
    max_proxy_size_mb: largeBinaryProxyLimitMb,
  })

  return NextResponse.redirect(target, {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
      "X-Release-Download-Mode": "redirect-only",
    },
  })
}
