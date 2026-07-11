import { NextResponse } from "next/server"
import { getProductBySlug, getPublishedReleaseByVersion } from "@/lib/garmentsos-pro"
import { isMongoConnectionError, mongoConnectionErrorMessage } from "@/lib/mongodb"

export const runtime = "nodejs"

const githubReleaseAssetUrlPattern =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/i

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

function parseGithubReleaseAssetUrl(value: string) {
  const match = value.match(githubReleaseAssetUrlPattern)
  if (!match) return null

  return {
    owner: decodeURIComponent(match[1]),
    repo: decodeURIComponent(match[2]),
    tag: decodeURIComponent(match[3]),
    asset: decodeURIComponent(match[4]),
  }
}

function isSafeExternalSetupUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && !url.pathname.startsWith("/api/downloads/")
  } catch {
    return false
  }
}

async function fetchGithubAsset(reference: { owner: string; repo: string; tag: string; asset: string }) {
  const token = process.env.GITHUB_RELEASE_TOKEN

  if (!token) {
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
    return jsonError("GitHub release was not found.", releaseResponse.status === 404 ? 404 : 502)
  }

  const githubRelease = (await releaseResponse.json()) as {
    assets?: Array<{
      name: string
      url: string
      size?: number
      content_type?: string
    }>
  }

  const asset = githubRelease.assets?.find((item) => item.name === reference.asset)

  if (!asset?.url) {
    return jsonError("GitHub setup asset is missing.", 404)
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
    return jsonError("GitHub setup asset download failed.", assetResponse.status === 404 ? 404 : 502)
  }

  return new Response(assetResponse.body, {
    status: 200,
    headers: {
      "Content-Type": asset.content_type || assetResponse.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${asset.name.replaceAll('"', "")}"`,
      "Cache-Control": "no-store",
      ...(asset.size ? { "Content-Length": String(asset.size) } : {}),
    },
  })
}

export async function GET(_request: Request, { params }: { params: Promise<{ productSlug: string; version: string }> }) {
  const { productSlug, version } = await params

  try {
    const product = await getProductBySlug(productSlug)
    const release = await getPublishedReleaseByVersion(productSlug, version)

    if (!product || !release || !release.is_published) {
      return NextResponse.json({ error: "Published release was not found." }, { status: 404 })
    }

    if (release.setup_url && isSafeExternalSetupUrl(release.setup_url)) {
      const parsedSetupUrl = parseGithubReleaseAssetUrl(release.setup_url)

      if (!parsedSetupUrl) {
        return NextResponse.redirect(release.setup_url, {
          status: 302,
          headers: { "Cache-Control": "no-store" },
        })
      }

      return fetchGithubAsset(parsedSetupUrl)
    }

    const owner = release.github_owner || product.github_owner
    const repo = release.github_repo || product.github_repo
    const tag = release.github_tag || `${product.release_tag_prefix || "v"}${release.version}`

    if (!owner || !repo || !tag) {
      return NextResponse.json({ error: "Setup asset source is not configured." }, { status: 404 })
    }

    return fetchGithubAsset({
      owner,
      repo,
      tag,
      asset: product.setup_asset_pattern || "GarmentsOS-PRO.exe",
    })
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json({ error: mongoConnectionErrorMessage }, { status: 503 })
    }

    throw error
  }
}
