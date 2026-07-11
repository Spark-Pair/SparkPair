import { NextResponse } from "next/server"
import type { Product, ProductRelease } from "@/lib/garmentsos-pro"

type GithubAssetReference = {
  owner: string
  repo: string
  tag: string
  asset: string
}

type GithubReleaseAsset = {
  name: string
  url: string
  size?: number
  content_type?: string
}

const githubReleaseAssetUrlPattern =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/i

function jsonError(error: string, status: number, details?: Record<string, string>) {
  return NextResponse.json(details ? { error, ...details } : { error }, { status })
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

function isGithubReleaseAssetUrl(value: string) {
  return githubReleaseAssetUrlPattern.test(value)
}

function isSparkPairDownloadUrl(value: string) {
  try {
    const url = new URL(value)
    return url.pathname.startsWith("/api/downloads/")
  } catch {
    return false
  }
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

function getGithubAssetReference(product: Product, release: ProductRelease): GithubAssetReference | null {
  const parsed = release.package_url ? parseGithubReleaseAssetUrl(release.package_url) : null
  if (parsed) return parsed

  const owner = release.github_owner || product.github_owner
  const repo = release.github_repo || product.github_repo
  const tag = release.github_tag || `${product.release_tag_prefix || "v"}${release.version}`
  const asset = release.github_asset || release.package_file

  if (!owner || !repo || !tag || !asset) return null

  return { owner, repo, tag, asset }
}

function releaseDownloadMode() {
  return process.env.RELEASE_DOWNLOAD_MODE || "storage_or_github_proxy"
}

function isStorageRedirectAllowed(release: ProductRelease) {
  return Boolean(
    release.package_url &&
      isHttpsUrl(release.package_url) &&
      !isGithubReleaseAssetUrl(release.package_url) &&
      !isSparkPairDownloadUrl(release.package_url),
  )
}

async function fetchGithubAsset(reference: GithubAssetReference) {
  const token = process.env.GITHUB_RELEASE_TOKEN

  if (!token) {
    console.error("GitHub release download failed: GITHUB_RELEASE_TOKEN is missing.", {
      owner: reference.owner,
      repo: reference.repo,
      tag: reference.tag,
      asset: reference.asset,
    })
    return jsonError("GitHub release token is not configured.", 500)
  }

  const releaseUrl = `https://api.github.com/repos/${encodeURIComponent(reference.owner)}/${encodeURIComponent(reference.repo)}/releases/tags/${encodeURIComponent(reference.tag)}`
  const releaseResponse = await fetch(releaseUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "SparkPair-release-downloads",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  })

  if (!releaseResponse.ok) {
    console.error("GitHub release lookup failed.", {
      owner: reference.owner,
      repo: reference.repo,
      tag: reference.tag,
      status: String(releaseResponse.status),
    })
    return jsonError("GitHub release asset was not found.", releaseResponse.status === 404 ? 404 : 502)
  }

  const githubRelease = (await releaseResponse.json()) as { assets?: GithubReleaseAsset[] }
  const asset = githubRelease.assets?.find((item) => item.name === reference.asset)

  if (!asset?.url) {
    console.error("GitHub release asset missing.", {
      owner: reference.owner,
      repo: reference.repo,
      tag: reference.tag,
      asset: reference.asset,
    })
    return jsonError("GitHub release asset is missing.", 404)
  }

  const assetResponse = await fetch(asset.url, {
    headers: {
      Accept: "application/octet-stream",
      Authorization: `Bearer ${token}`,
      "User-Agent": "SparkPair-release-downloads",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  })

  if (!assetResponse.ok || !assetResponse.body) {
    console.error("GitHub release asset download failed.", {
      owner: reference.owner,
      repo: reference.repo,
      tag: reference.tag,
      asset: reference.asset,
      status: String(assetResponse.status),
    })
    return jsonError("GitHub release asset download failed.", assetResponse.status === 404 ? 404 : 502)
  }

  return new Response(assetResponse.body, {
    status: 200,
    headers: {
      "Content-Type": asset.content_type || assetResponse.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${asset.name.replaceAll('"', "")}"`,
      "Cache-Control": "no-store",
      "X-Package-SHA256": "",
      ...(asset.size ? { "Content-Length": String(asset.size) } : {}),
    },
  })
}

export function buildSparkPairPackageUrl(requestUrl: string, productSlug: string, version: string) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_SITE_URL
  const origin = configuredBaseUrl || new URL(requestUrl).origin
  return `${origin.replace(/\/$/, "")}/api/downloads/${encodeURIComponent(productSlug)}/${encodeURIComponent(version)}`
}

export function buildSparkPairSetupUrl(requestUrl: string, productSlug: string, version: string) {
  return `${buildSparkPairPackageUrl(requestUrl, productSlug, version)}/setup`
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

export async function createReleasePackageResponse(product: Product, release: ProductRelease) {
  if (isStorageRedirectAllowed(release)) {
    return NextResponse.redirect(release.package_url, {
      status: 302,
      headers: {
        "Cache-Control": "no-store",
        "X-Package-SHA256": release.package_sha256,
      },
    })
  }

  const githubReference = getGithubAssetReference(product, release)
  const mode = releaseDownloadMode()

  if (!githubReference || mode === "storage_only") {
    console.error("Release package storage URL is missing.", {
      product: product.slug,
      version: release.version,
      channel: release.channel,
      mode,
    })
    return jsonError("Storage package URL is missing.", 404)
  }

  const response = await fetchGithubAsset(githubReference)
  response.headers.set("X-Package-SHA256", release.package_sha256)
  return response
}
