import { createHash, randomBytes, randomUUID } from "crypto"
import { getMongoDb } from "@/lib/mongodb"

export const productKey = "garmentsos-pro"
export const productName = "GarmentsOS PRO"

export type ReleaseChannel = "stable" | "beta" | "dev"
export type CustomerStatus = "active" | "inactive"
export type LicenseStatus = "active" | "suspended" | "expired"
export type DeviceStatus = "pending" | "approved" | "blocked"
export type ProductType = "desktop_app" | "web_app" | "saas" | "portfolio_project" | "service"
export type ProductStatus = "draft" | "active" | "archived"
export type ActivationRequestStatus = "pending" | "approved" | "rejected"
export type ActivationRequestType = "demo_trial" | "paid_activation"

export interface ProductMedia {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  alt: string
  caption: string
  sort_order: number
}

export interface Product {
  id: string
  product_key: string
  slug: string
  name: string
  type: ProductType
  status: ProductStatus
  short_description: string
  description: string
  logo_url: string
  hero_image_url: string
  screenshots: { id: string; title: string; url: string }[]
  website_url: string
  live_url: string
  demo_url: string
  video_url: string
  video_embed_url: string
  logo_image: ProductMedia | null
  hero_image: ProductMedia | null
  gallery_images: ProductMedia[]
  download_enabled: boolean
  portfolio_enabled: boolean
  featured: boolean
  sort_order: number
  category: string
  tech_stack: string[]
  github_owner: string
  github_repo: string
  github_branch: string
  release_tag_prefix: string
  package_asset_pattern: string
  setup_asset_pattern: string
  default_channel: ReleaseChannel
  update_feed_enabled: boolean
  public_download_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  client_id: string
  status: CustomerStatus
  notes: string
  created_at: string
  updated_at: string
}

export interface ProductRelease {
  id: string
  product_key: string
  product_id: string
  product_slug: string
  version: string
  channel: ReleaseChannel
  mandatory: boolean
  released_at: string
  package_file: string
  package_url: string
  package_sha256: string
  setup_url: string
  github_owner?: string
  github_repo?: string
  github_tag?: string
  github_asset?: string
  notes: string
  is_published: boolean
  is_latest: boolean
  created_at: string
  updated_at: string
}

export interface ProductLicense {
  id: string
  customer_id: string
  product_key: string
  client_id: string
  client_name: string
  license_key_hash: string
  license_key_preview: string
  status: LicenseStatus
  expires_at: string
  grace_days: number
  allowed_channel: ReleaseChannel
  allowed_devices: number
  install_id: string
  machine_hash: string
  legacy_machine_hashes?: string[]
  notes: string
  last_check_at: string
  created_at: string
  updated_at: string
}

export interface LicenseDevice {
  id: string
  product_key: string
  install_id: string
  machine_hash: string
  machine_name: string
  app_version: string
  ip_address: string
  user_agent: string
  status: DeviceStatus
  customer_id: string
  license_id: string
  legacy_machine_hashes?: string[]
  fingerprint_source?: string
  fingerprint_version?: number
  last_rebind_at?: string
  first_seen_at: string
  last_seen_at: string
  approved_at: string
  blocked_at: string
  notes: string
  created_at: string
  updated_at: string
}

export interface LicenseCheck {
  id: string
  license_id: string
  product_key: string
  client_id: string
  install_id: string
  app_version: string
  status: string
  valid: boolean
  checked_at: string
  message: string
}

export interface ActivityLog {
  id: string
  product_key: string
  type: string
  subject_type: string
  subject_id: string
  message: string
  details?: Record<string, unknown>
  created_at: string
}

export interface ActivationRequest {
  id: string
  product_slug: string
  product_key: string
  request_type: ActivationRequestType
  business_name: string
  owner_name: string
  phone: string
  email: string
  city: string
  address: string
  install_id: string
  machine_hash: string
  machine_name: string
  app_version: string
  status: ActivationRequestStatus
  customer_id: string
  license_id: string
  device_id: string
  notes: string
  created_at: string
  updated_at: string
}

export interface LicenseCreateResult {
  license: ProductLicense
  plain_key?: string
}

const channels: ReleaseChannel[] = ["stable", "beta", "dev"]
const nowIso = () => new Date().toISOString()

export function slugifyProduct(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function garmentsOsProduct(now: string): Product {
  return {
    id: "prod-garmentsos-pro",
    product_key: productKey,
    slug: productKey,
    name: productName,
    type: "desktop_app",
    status: "active",
    short_description: "ERP and production management system for garment factories.",
    description:
      "A full-featured ERP for garment factories, streamlining production, inventory, billing, and workforce management.",
    logo_url: "/images/garmentsos-pro/garmentsos-pro.webp",
    hero_image_url: "/images/garmentsos-pro/garmentsos-pro.webp",
    screenshots: [
      { id: "s01", title: "Menu", url: "/images/garmentsos-pro/screenshot_1.webp" },
      { id: "s02", title: "Showcase", url: "/images/garmentsos-pro/screenshot_2.webp" },
      { id: "s03", title: "Form", url: "/images/garmentsos-pro/screenshot_3.webp" },
    ],
    website_url: "",
    live_url: "",
    demo_url: "",
    video_url: "",
    video_embed_url: "",
    logo_image: null,
    hero_image: null,
    gallery_images: [],
    download_enabled: true,
    portfolio_enabled: true,
    featured: true,
    sort_order: 1,
    category: "Desktop ERP",
    tech_stack: ["PHP", "Laravel", "SQLite 3"],
    github_owner: process.env.GITHUB_RELEASE_OWNER || "Spark-Pair",
    github_repo: process.env.GITHUB_RELEASE_REPO || "garmentsos-pro",
    github_branch: "main",
    release_tag_prefix: "v",
    package_asset_pattern: "garmentsos-pro-{version}.zip",
    setup_asset_pattern: "GarmentsOS-PRO.exe",
    default_channel: "stable",
    update_feed_enabled: true,
    public_download_enabled: true,
    created_at: now,
    updated_at: now,
  }
}

async function collections() {
  const db = await getMongoDb()
  return {
    products: db.collection<Product>("products"),
    customers: db.collection<Customer>("customers"),
    releases: db.collection<ProductRelease>("product_releases"),
    licenses: db.collection<ProductLicense>("licenses"),
    checks: db.collection<LicenseCheck>("license_checks"),
    devices: db.collection<LicenseDevice>("license_devices"),
    activationRequests: db.collection<ActivationRequest>("activation_requests"),
    activity: db.collection<ActivityLog>("activity_logs"),
  }
}

let indexesPromise: Promise<void> | null = null

export async function ensureGarmentsOsProData() {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const c = await collections()
      await Promise.all([
        c.products.createIndex({ product_key: 1 }, { unique: true }),
        c.products.createIndex({ slug: 1 }, { unique: true }),
        c.releases.createIndex({ product_key: 1, channel: 1, version: 1 }, { unique: true }),
        c.releases.createIndex({ product_slug: 1, channel: 1, version: 1 }),
        c.releases.createIndex({ product_key: 1, channel: 1, is_latest: 1 }),
        c.licenses.createIndex({ product_key: 1, client_id: 1 }),
        c.licenses.createIndex({ license_key_hash: 1 }),
        c.checks.createIndex({ license_id: 1, checked_at: -1 }),
        c.checks.createIndex({ product_key: 1, client_id: 1, checked_at: -1 }),
        c.devices.createIndex({ product_key: 1, install_id: 1 }, { unique: true }),
        c.devices.createIndex(
          { product_key: 1, machine_hash: 1 },
          { unique: true, partialFilterExpression: { machine_hash: { $gt: "" } } },
        ),
        c.activationRequests.createIndex({ product_key: 1, install_id: 1, created_at: -1 }),
        c.activationRequests.createIndex({ product_slug: 1, status: 1, created_at: -1 }),
        c.activationRequests.createIndex({ status: 1, created_at: -1 }),
        c.activity.createIndex({ product_key: 1, created_at: -1 }),
      ])

      const now = nowIso()
      const existingProduct = await c.products.findOne({ product_key: productKey })
      const seed = garmentsOsProduct(now)

      if (!existingProduct) {
        await c.products.insertOne(seed)
      } else {
        await c.products.updateOne(
          { product_key: productKey },
          {
            $set: {
              slug: existingProduct.slug || productKey,
              type: existingProduct.type || seed.type,
              status: existingProduct.status || seed.status,
              short_description: existingProduct.short_description || seed.short_description,
              description: existingProduct.description || seed.description,
              logo_url: existingProduct.logo_url || seed.logo_url,
              hero_image_url: existingProduct.hero_image_url || seed.hero_image_url,
              screenshots: existingProduct.screenshots || seed.screenshots,
              download_enabled: existingProduct.download_enabled ?? seed.download_enabled,
              live_url: existingProduct.live_url || seed.live_url,
              demo_url: existingProduct.demo_url || seed.demo_url,
              video_url: existingProduct.video_url || seed.video_url,
              video_embed_url: existingProduct.video_embed_url || seed.video_embed_url,
              logo_image: existingProduct.logo_image || seed.logo_image,
              hero_image: existingProduct.hero_image || seed.hero_image,
              gallery_images: existingProduct.gallery_images || seed.gallery_images,
              portfolio_enabled: existingProduct.portfolio_enabled ?? seed.portfolio_enabled,
              featured: existingProduct.featured ?? seed.featured,
              sort_order: existingProduct.sort_order ?? seed.sort_order,
              category: existingProduct.category || seed.category,
              tech_stack: existingProduct.tech_stack || seed.tech_stack,
              github_owner: existingProduct.github_owner || seed.github_owner,
              github_repo: existingProduct.github_repo || seed.github_repo,
              github_branch: existingProduct.github_branch || seed.github_branch,
              release_tag_prefix: existingProduct.release_tag_prefix || seed.release_tag_prefix,
              package_asset_pattern: existingProduct.package_asset_pattern || seed.package_asset_pattern,
              setup_asset_pattern: existingProduct.setup_asset_pattern || seed.setup_asset_pattern,
              default_channel: existingProduct.default_channel || seed.default_channel,
              update_feed_enabled: existingProduct.update_feed_enabled ?? seed.update_feed_enabled,
              public_download_enabled: existingProduct.public_download_enabled ?? seed.public_download_enabled,
              updated_at: now,
            },
          },
        )
      }

      await c.releases.updateMany(
        { product_key: productKey, $or: [{ product_slug: { $exists: false } }, { product_id: { $exists: false } }] },
        { $set: { product_id: "prod-garmentsos-pro", product_slug: productKey } },
      )
    })()
  }

  await indexesPromise
}

async function recordActivity(
  type: string,
  subject_type: string,
  subject_id: string,
  message: string,
  details?: Record<string, unknown>,
) {
  const c = await collections()
  const now = nowIso()
  await c.activity.insertOne({
    id: `act-${randomUUID().slice(0, 10)}`,
    product_key: productKey,
    type,
    subject_type,
    subject_id,
    message,
    details,
    created_at: now,
  })
}

function compareVersions(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}

function withoutMongoId<T extends { _id?: unknown }>(item: T): Omit<T, "_id"> {
  const { _id, ...rest } = item
  void _id
  return rest
}

export function isReleaseChannel(channel: string): channel is ReleaseChannel {
  return channels.includes(channel as ReleaseChannel)
}

export function getLicensePepper() {
  const pepper = process.env.LICENSE_KEY_PEPPER

  if (!pepper) {
    throw new Error("LICENSE_KEY_PEPPER is required for license verification.")
  }

  return pepper
}

export function hashLicenseKey(licenseKey: string) {
  return createHash("sha256")
    .update(`${licenseKey.trim().toUpperCase()}:${getLicensePepper()}`)
    .digest("hex")
}

export function generateLicenseKey() {
  const chunks = Array.from({ length: 4 }, () => randomBytes(2).toString("hex").toUpperCase())
  return `GOS-${chunks.join("-")}`
}

export function maskLicenseKey(licenseKey: string) {
  const normalized = licenseKey.trim().toUpperCase()
  const end = normalized.slice(-4)
  return `GOS-****-****-****-${end}`
}

function normalizeMedia(media: ProductMedia | null | undefined): ProductMedia | null {
  if (!media?.public_id || !media.secure_url) {
    if (media?.secure_url?.startsWith("/")) {
      return {
        public_id: "",
        secure_url: String(media.secure_url),
        width: Number(media.width || 0),
        height: Number(media.height || 0),
        format: String(media.format || ""),
        resource_type: String(media.resource_type || "image"),
        alt: String(media.alt || ""),
        caption: String(media.caption || ""),
        sort_order: Number(media.sort_order || 0),
      }
    }
    return null
  }

  try {
    const url = new URL(media.secure_url)
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
      return null
    }
  } catch {
    return null
  }

  return {
    public_id: String(media.public_id),
    secure_url: String(media.secure_url),
    width: Number(media.width || 0),
    height: Number(media.height || 0),
    format: String(media.format || ""),
    resource_type: String(media.resource_type || "image"),
    alt: String(media.alt || ""),
    caption: String(media.caption || ""),
    sort_order: Number(media.sort_order || 0),
  }
}

function normalizeGallery(images: ProductMedia[] | null | undefined) {
  return (images ?? [])
    .map(normalizeMedia)
    .filter((image): image is ProductMedia => Boolean(image))
    .sort((a, b) => a.sort_order - b.sort_order)
}

export async function getProducts() {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.products.find({}).sort({ sort_order: 1, name: 1 }).toArray()).map(withoutMongoId)
}

export async function getProduct(product_key = productKey) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const product = await c.products.findOne({ $or: [{ product_key }, { slug: product_key }] })
  return product ? withoutMongoId(product) : null
}

export async function getProductBySlug(slug: string) {
  return getProduct(slug)
}

export async function getDownloadProducts() {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (
    await c.products
      .find({ status: "active", download_enabled: true, public_download_enabled: true })
      .sort({ sort_order: 1, name: 1 })
      .toArray()
  ).map(withoutMongoId)
}

export async function getPortfolioProducts() {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (
    await c.products
      .find({ status: "active", portfolio_enabled: true })
      .sort({ featured: -1, sort_order: 1, name: 1 })
      .toArray()
  ).map(withoutMongoId)
}

export async function saveProduct(input: Omit<Product, "id" | "product_key" | "slug" | "created_at" | "updated_at"> & { slug?: string }, slug?: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const nextSlug = slugifyProduct(input.slug || slug || input.name)
  const existing = slug ? await c.products.findOne({ slug }) : await c.products.findOne({ slug: nextSlug })
  const now = nowIso()
  const product: Product = {
    ...input,
    id: existing?.id ?? `prod-${randomUUID().slice(0, 8)}`,
    product_key: existing?.product_key ?? nextSlug,
    slug: existing?.slug ?? nextSlug,
    screenshots: input.screenshots ?? [],
    live_url: input.live_url ?? "",
    demo_url: input.demo_url ?? "",
    video_url: input.video_url ?? "",
    video_embed_url: input.video_embed_url ?? "",
    logo_image: normalizeMedia(input.logo_image),
    hero_image: normalizeMedia(input.hero_image),
    gallery_images: normalizeGallery(input.gallery_images),
    tech_stack: input.tech_stack ?? [],
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  await c.products.updateOne({ slug: product.slug }, { $set: product }, { upsert: true })
  await recordActivity(existing ? "product.updated" : "product.created", "product", product.id, `${product.name} ${existing ? "updated" : "created"}.`)
  return product
}

export async function archiveProduct(slug: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  await c.products.updateOne({ slug }, { $set: { status: "archived", updated_at: nowIso() } })
  await recordActivity("product.archived", "product", slug, "Product archived.")
}

export async function deleteProductIfSafe(slug: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const product = await c.products.findOne({ slug })
  if (!product) return { ok: false, message: "Product was not found." }
  const [releaseCount, licenseCount, deviceCount] = await Promise.all([
    c.releases.countDocuments({ product_key: product.product_key }),
    c.licenses.countDocuments({ product_key: product.product_key }),
    c.devices.countDocuments({ product_key: product.product_key }),
  ])
  if (releaseCount || licenseCount || deviceCount) {
    return { ok: false, message: "Product has releases, licenses, or devices. Archive it instead." }
  }
  await c.products.deleteOne({ slug })
  await recordActivity("product.deleted", "product", product.id, `${product.name} deleted.`)
  return { ok: true, message: "Product deleted." }
}

export async function getCustomers() {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.customers.find({}).sort({ updated_at: -1 }).toArray()).map(withoutMongoId)
}

export async function getCustomer(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const customer = await c.customers.findOne({ id })
  return customer ? withoutMongoId(customer) : null
}

export async function saveCustomer(input: Omit<Customer, "id" | "created_at" | "updated_at">, id?: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const existing = id ? await c.customers.findOne({ id }) : null
  const now = nowIso()
  const customer: Customer = {
    ...input,
    id: existing?.id ?? `cust-${randomUUID().slice(0, 8)}`,
    client_id: input.client_id.trim(),
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  await c.customers.updateOne({ id: customer.id }, { $set: customer }, { upsert: true })
  await recordActivity(existing ? "customer.updated" : "customer.created", "customer", customer.id, `${customer.name} ${existing ? "updated" : "created"}.`)
  return customer
}

export async function archiveCustomer(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const now = nowIso()
  await c.customers.updateOne({ id }, { $set: { status: "inactive", updated_at: now } })
  await recordActivity("customer.archived", "customer", id, "Customer archived.")
}

export async function deleteCustomerIfSafe(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const licenseCount = await c.licenses.countDocuments({ customer_id: id })
  const deviceCount = await c.devices.countDocuments({ customer_id: id })

  if (licenseCount || deviceCount) {
    return { ok: false, message: "Customer has licenses or devices and cannot be deleted. Archive it instead." }
  }

  await c.customers.deleteOne({ id })
  await recordActivity("customer.deleted", "customer", id, "Customer deleted.")
  return { ok: true, message: "Customer deleted." }
}

export async function getReleases(productSlug = productKey) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const product = await getProduct(productSlug)
  const query = product ? { product_key: product.product_key } : { product_key: productSlug }
  const releases = (await c.releases.find(query).sort({ released_at: -1 }).toArray()).map(withoutMongoId)
  return releases.sort((a, b) => {
    const dateCompare = Date.parse(b.released_at) - Date.parse(a.released_at)
    return dateCompare || compareVersions(b.version, a.version)
  })
}

export async function getRelease(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const release = await c.releases.findOne({ id })
  return release ? withoutMongoId(release) : null
}

export async function getLatestRelease(channel: ReleaseChannel, productSlug = productKey) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const product = await getProduct(productSlug)
  if (!product || !product.update_feed_enabled) return null
  const latest = await c.releases.findOne(
    { product_key: product.product_key, channel, is_published: true, is_latest: true },
    { sort: { released_at: -1 } },
  )

  if (latest) {
    return withoutMongoId(latest)
  }

  const fallback = await c.releases.findOne({ product_key: product.product_key, channel, is_published: true }, { sort: { released_at: -1 } })
  return fallback ? withoutMongoId(fallback) : null
}

export async function getPublishedReleaseByVersion(productSlug: string, version: string, channel?: ReleaseChannel) {
  await ensureGarmentsOsProData()

  const c = await collections()
  const product = await getProduct(productSlug)

  if (!product) {
    return null
  }

  const query: Record<string, unknown> = {
    product_key: product.product_key,
    version,
    is_published: true,
  }

  if (channel) {
    query.channel = channel
  }

  const release = await c.releases.findOne(query, { sort: { released_at: -1 } })

  return release ? withoutMongoId(release) : null
}

export async function saveRelease(
  input: Omit<ProductRelease, "id" | "product_key" | "product_id" | "product_slug" | "created_at" | "updated_at">,
  id?: string,
  productSlug = productKey,
) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const existing = id ? await c.releases.findOne({ id }) : null
  const product = await getProduct(productSlug)
  if (!product) {
    throw new Error(`Product ${productSlug} was not found.`)
  }
  const now = nowIso()
  const release: ProductRelease = {
    ...input,
    id:
      existing?.id ??
      `rel-${product.slug}-${input.version.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${input.channel}`,
    product_key: product.product_key,
    product_id: product.id,
    product_slug: product.slug,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  if (release.is_latest) {
    await c.releases.updateMany({ product_key: product.product_key, channel: release.channel }, { $set: { is_latest: false } })
  }

  await c.releases.updateOne(
    { product_key: product.product_key, channel: release.channel, version: release.version },
    { $set: release },
    { upsert: true },
  )
  await recordActivity(existing ? "release.updated" : "release.created", "release", release.id, `Release ${release.version} ${existing ? "updated" : "created"}.`)
  return release
}

export async function setReleaseLatest(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const release = await c.releases.findOne({ id })
  if (!release) return
  const now = nowIso()
  await c.releases.updateMany({ product_key: release.product_key, channel: release.channel }, { $set: { is_latest: false } })
  await c.releases.updateOne({ id }, { $set: { is_latest: true, is_published: true, updated_at: now } })
  await recordActivity("release.latest", "release", id, `Release ${release.version} marked latest.`)
}

export async function unpublishRelease(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  await c.releases.updateOne({ id }, { $set: { is_published: false, is_latest: false, updated_at: nowIso() } })
  await recordActivity("release.unpublished", "release", id, "Release unpublished.")
}

export async function deleteReleaseIfSafe(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const release = await c.releases.findOne({ id })
  if (!release) return { ok: false, message: "Release was not found." }
  if (release.is_latest || release.is_published) {
    return { ok: false, message: "Only draft, non-latest releases can be deleted. Unpublish it first." }
  }
  await c.releases.deleteOne({ id })
  await recordActivity("release.deleted", "release", id, `Release ${release.version} deleted.`)
  return { ok: true, message: "Release deleted." }
}

export async function upsertSyncedRelease(input: {
  product?: string
  app?: string
  version: string
  channel: ReleaseChannel
  mandatory?: boolean
  released_at: string
  package_file: string
  package_url: string
  package_sha256: string
  setup_url: string
  notes: string
  github_owner?: string
  github_repo?: string
  github_tag?: string
  github_asset?: string
}) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const productSlug = input.app || input.product || productKey
  const product = await getProduct(productSlug)
  if (!product) {
    throw new Error(`Product ${productSlug} was not found.`)
  }
  const existing = await c.releases.findOne({ product_key: product.product_key, version: input.version, channel: input.channel })

  return saveRelease(
    {
      version: input.version,
      channel: input.channel,
      mandatory: Boolean(input.mandatory),
      released_at: new Date(input.released_at).toISOString(),
      package_file: input.package_file,
      package_url: input.package_url,
      package_sha256: input.package_sha256,
      setup_url: input.setup_url,
      github_owner: input.github_owner,
      github_repo: input.github_repo,
      github_tag: input.github_tag,
      github_asset: input.github_asset,
      notes: input.notes,
      is_published: true,
      is_latest: true,
    },
    existing?.id,
    product.slug,
  )
}

export async function getLicenses() {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.licenses.find({}).sort({ updated_at: -1 }).toArray()).map(withoutMongoId)
}

export async function getLicense(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const license = await c.licenses.findOne({ id })
  return license ? withoutMongoId(license) : null
}

export async function getLicensesForCustomer(customer_id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.licenses.find({ customer_id }).sort({ updated_at: -1 }).toArray()).map(withoutMongoId)
}

export async function saveLicense(
  input: Omit<ProductLicense, "id" | "product_key" | "license_key_hash" | "license_key_preview" | "last_check_at" | "created_at" | "updated_at"> & {
    plain_key?: string
  },
  id?: string,
): Promise<LicenseCreateResult> {
  await ensureGarmentsOsProData()
  const c = await collections()
  const existing = id ? await c.licenses.findOne({ id }) : null
  const now = nowIso()
  const plainKey = input.plain_key?.trim() || (!existing ? generateLicenseKey() : "")
  const license: ProductLicense = {
    ...input,
    id: existing?.id ?? `lic-${randomUUID().slice(0, 8)}`,
    product_key: productKey,
    license_key_hash: plainKey ? hashLicenseKey(plainKey) : existing?.license_key_hash ?? "",
    license_key_preview: plainKey ? maskLicenseKey(plainKey) : existing?.license_key_preview ?? "GOS-****-****-****-****",
    grace_days: Number(input.grace_days),
    allowed_devices: Number(input.allowed_devices || 1),
    install_id: input.install_id.trim(),
    machine_hash: input.machine_hash.trim(),
    last_check_at: existing?.last_check_at ?? "",
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  await c.licenses.updateOne({ id: license.id }, { $set: license }, { upsert: true })
  await recordActivity(existing ? "license.updated" : "license.created", "license", license.id, `${license.client_name} license ${existing ? "updated" : "created"}.`)
  return { license, plain_key: plainKey || undefined }
}

export async function updateLicenseStatus(id: string, status: LicenseStatus) {
  await ensureGarmentsOsProData()
  const c = await collections()
  await c.licenses.updateOne({ id }, { $set: { status, updated_at: nowIso() } })
  await recordActivity(`license.${status}`, "license", id, `License ${status}.`)
}

export async function deleteLicenseIfSafe(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const activeDevices = await c.devices.countDocuments({ license_id: id, status: "approved" })
  if (activeDevices) {
    return { ok: false, message: "License has active approved devices and cannot be deleted. Suspend it instead." }
  }
  await c.licenses.deleteOne({ id })
  await c.devices.updateMany({ license_id: id }, { $set: { license_id: "", status: "pending", updated_at: nowIso() } })
  await recordActivity("license.deleted", "license", id, "License deleted.")
  return { ok: true, message: "License deleted." }
}

export async function getLicenseChecks(license_id?: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.checks.find(license_id ? { license_id } : {}).sort({ checked_at: -1 }).toArray()).map(withoutMongoId)
}

function getLicenseEvaluation(license: ProductLicense) {
  let status: "active" | "grace" | "expired" | "suspended" = "active"
  let valid = true
  let message = "License active"
  const expiresAt = Date.parse(`${license.expires_at}T23:59:59.000Z`)
  const graceEndsAt = expiresAt + license.grace_days * 24 * 60 * 60 * 1000

  if (license.status === "suspended") {
    status = "suspended"
    valid = false
    message = "License suspended. Please contact SparkPair."
  } else if (license.status === "expired" || Date.now() > graceEndsAt) {
    status = "expired"
    valid = false
    message = "License expired. Please contact SparkPair."
  } else if (Date.now() > expiresAt) {
    status = "grace"
    valid = true
    message = "License is in grace period."
  }

  return { status, valid, message }
}

export async function getLicenseDevices(status?: DeviceStatus) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const query = status ? { product_key: productKey, status } : { product_key: productKey }
  return (await c.devices.find(query).sort({ updated_at: -1 }).toArray()).map(withoutMongoId)
}

export async function getLicenseDevice(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const device = await c.devices.findOne({ id })
  return device ? withoutMongoId(device) : null
}

export async function registerInstall(input: {
  product: string
  install_id: string
  machine_hash: string
  machine_name: string
  app_version: string
  ip_address: string
  user_agent: string
}) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const now = nowIso()

  if (input.product !== productKey) {
    return { registered: false, status: "invalid", message: "Invalid product." }
  }

  const existing = await c.devices.findOne({ product_key: productKey, install_id: input.install_id })
  const device: LicenseDevice = {
    id: existing?.id ?? `dev-${randomUUID().slice(0, 10)}`,
    product_key: productKey,
    install_id: input.install_id,
    machine_hash: input.machine_hash,
    machine_name: input.machine_name,
    app_version: input.app_version,
    ip_address: input.ip_address,
    user_agent: input.user_agent,
    status: existing?.status ?? "pending",
    customer_id: existing?.customer_id ?? "",
    license_id: existing?.license_id ?? "",
    first_seen_at: existing?.first_seen_at ?? now,
    last_seen_at: now,
    approved_at: existing?.approved_at ?? "",
    blocked_at: existing?.blocked_at ?? "",
    notes: existing?.notes ?? "",
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  await c.devices.updateOne(
    { product_key: productKey, install_id: input.install_id },
    { $set: device },
    { upsert: true },
  )

  if (device.status === "approved" && device.license_id) {
    const license = await c.licenses.findOne({ id: device.license_id })
    if (license) {
      const result = getLicenseEvaluation(withoutMongoId(license))
      return {
        registered: true,
        status: device.status,
        valid: result.valid,
        license_status: result.status,
        client_name: license.client_name,
        expires_at: license.expires_at,
        grace_days: license.grace_days,
        message: result.message,
      }
    }
  }

  if (device.status === "blocked") {
    return { registered: true, status: "blocked", message: "Device is blocked. Please contact SparkPair." }
  }

  return { registered: true, status: device.status, message: "Install registered. Waiting for approval." }
}

export async function updateLicenseDevice(
  id: string,
  input: {
    status: DeviceStatus
    customer_id: string
    license_id: string
    notes: string
  },
) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const existing = await c.devices.findOne({ id })

  if (!existing) {
    return null
  }

  const now = nowIso()
  const next: LicenseDevice = {
    ...withoutMongoId(existing),
    status: input.status,
    customer_id: input.customer_id,
    license_id: input.license_id,
    notes: input.notes,
    approved_at: input.status === "approved" ? existing.approved_at || now : existing.approved_at,
    blocked_at: input.status === "blocked" ? now : "",
    updated_at: now,
  }

  await c.devices.updateOne({ id }, { $set: next })
  await recordActivity(`device.${input.status}`, "device", id, `Device ${input.status}.`)

  if (input.license_id) {
    await c.licenses.updateOne(
      { id: input.license_id },
      {
        $set: {
          install_id: next.install_id,
          machine_hash: next.machine_hash,
          updated_at: now,
        },
      },
    )
  }

  return next
}

export async function unlinkLicenseDevice(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  await c.devices.updateOne(
    { id },
    { $set: { customer_id: "", license_id: "", status: "pending", approved_at: "", updated_at: nowIso() } },
  )
  await recordActivity("device.unlinked", "device", id, "Device unlinked from license and customer.")
}

export async function deleteStalePendingDevice(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const device = await c.devices.findOne({ id })
  if (!device) return { ok: false, message: "Device was not found." }
  if (device.status !== "pending" || device.license_id) {
    return { ok: false, message: "Only unlinked pending devices can be deleted." }
  }
  await c.devices.deleteOne({ id })
  await recordActivity("device.deleted", "device", id, "Pending device registration deleted.")
  return { ok: true, message: "Pending device deleted." }
}

export async function getActivityLogs(limit = 50) {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.activity.find({ product_key: productKey }).sort({ created_at: -1 }).limit(limit).toArray()).map(withoutMongoId)
}

export async function createCustomerAndLicenseForDevice(
  id: string,
  input: {
    customer_name: string
    customer_email: string
    expires_at: string
    grace_days: number
    allowed_channel: ReleaseChannel
    notes: string
  },
) {
  const device = await getLicenseDevice(id)
  if (!device) {
    return null
  }

  const customer = await saveCustomer({
    name: input.customer_name,
    email: input.customer_email,
    client_id: device.install_id,
    status: "active",
    notes: `Created from install ${device.install_id}.`,
  })

  const result = await saveLicense({
    customer_id: customer.id,
    client_id: customer.client_id,
    client_name: customer.name,
    status: "active",
    expires_at: input.expires_at,
    grace_days: input.grace_days,
    allowed_channel: input.allowed_channel,
    allowed_devices: 1,
    install_id: device.install_id,
    machine_hash: device.machine_hash,
    notes: input.notes,
  })

  await updateLicenseDevice(device.id, {
    status: "approved",
    customer_id: customer.id,
    license_id: result.license.id,
    notes: device.notes,
  })

  return { customer, license: result.license }
}

export async function createActivationRequest(input: {
  product: string
  request_type: ActivationRequestType
  business_name: string
  owner_name: string
  phone: string
  email: string
  city: string
  address: string
  install_id: string
  machine_hash: string
  machine_name: string
  app_version: string
}) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const product = await getProduct(input.product)

  if (!product || product.product_key !== productKey) {
    return { ok: false, status: "invalid", message: "Invalid product." }
  }

  const now = nowIso()
  const existing = await c.activationRequests.findOne({
    product_key: product.product_key,
    install_id: input.install_id,
    status: "pending",
  })

  const request: ActivationRequest = {
    id: existing?.id ?? `actreq-${randomUUID().slice(0, 10)}`,
    product_slug: product.slug,
    product_key: product.product_key,
    request_type: input.request_type,
    business_name: input.business_name.trim(),
    owner_name: input.owner_name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    city: input.city.trim(),
    address: input.address.trim(),
    install_id: input.install_id.trim(),
    machine_hash: input.machine_hash.trim(),
    machine_name: input.machine_name.trim(),
    app_version: input.app_version.trim(),
    status: existing?.status ?? "pending",
    customer_id: existing?.customer_id ?? "",
    license_id: existing?.license_id ?? "",
    device_id: existing?.device_id ?? "",
    notes: existing?.notes ?? "",
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  await c.activationRequests.updateOne({ id: request.id }, { $set: request }, { upsert: true })
  await recordActivity("activation.requested", "activation_request", request.id, `${request.business_name || request.machine_name} requested activation.`)

  return {
    ok: true,
    registered: true,
    status: request.status,
    request_id: request.id,
    message: "Activation request submitted. Waiting for approval.",
  }
}

export async function getActivationRequests(status?: ActivationRequestStatus) {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (
    await c.activationRequests
      .find(status ? { status } : {})
      .sort({ created_at: -1 })
      .toArray()
  ).map(withoutMongoId)
}

export async function getActivationRequest(id: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const request = await c.activationRequests.findOne({ id })
  return request ? withoutMongoId(request) : null
}

export async function rejectActivationRequest(id: string, notes: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  await c.activationRequests.updateOne(
    { id },
    { $set: { status: "rejected", notes, updated_at: nowIso() } },
  )
  await recordActivity("activation.rejected", "activation_request", id, "Activation request rejected.")
}

export async function approveActivationRequest(
  id: string,
  input: {
    customer_id?: string
    license_id?: string
    customer_name?: string
    customer_email?: string
    expires_at: string
    grace_days: number
    allowed_channel: ReleaseChannel
    notes: string
  },
) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const request = await c.activationRequests.findOne({ id })

  if (!request) {
    return null
  }

  let customer = input.customer_id ? await getCustomer(input.customer_id) : null
  if (!customer) {
    customer = await saveCustomer({
      name: input.customer_name?.trim() || request.business_name || request.owner_name || request.machine_name,
      email: input.customer_email?.trim() || request.email,
      client_id: request.install_id,
      status: "active",
      notes: `Created from ${request.request_type.replace("_", " ")} request ${request.id}.`,
    })
  }

  let license = input.license_id ? await getLicense(input.license_id) : null
  if (!license) {
    const result = await saveLicense({
      customer_id: customer.id,
      client_id: customer.client_id,
      client_name: customer.name,
      status: "active",
      expires_at: input.expires_at,
      grace_days: input.grace_days,
      allowed_channel: input.allowed_channel,
      allowed_devices: 1,
      install_id: request.install_id,
      machine_hash: request.machine_hash,
      notes: input.notes || `Approved from activation request ${request.id}.`,
    })
    license = result.license
  } else {
    await c.licenses.updateOne(
      { id: license.id },
      {
        $set: {
          customer_id: customer.id,
          client_id: customer.client_id,
          client_name: customer.name,
          install_id: request.install_id,
          machine_hash: request.machine_hash,
          updated_at: nowIso(),
        },
      },
    )
  }

  const now = nowIso()
  const existingDevice = await c.devices.findOne({ product_key: request.product_key, install_id: request.install_id })
  const device: LicenseDevice = {
    id: existingDevice?.id ?? `dev-${randomUUID().slice(0, 10)}`,
    product_key: request.product_key,
    install_id: request.install_id,
    machine_hash: request.machine_hash,
    machine_name: request.machine_name,
    app_version: request.app_version,
    ip_address: existingDevice?.ip_address ?? "",
    user_agent: existingDevice?.user_agent ?? "",
    status: "approved",
    customer_id: customer.id,
    license_id: license.id,
    first_seen_at: existingDevice?.first_seen_at ?? request.created_at,
    last_seen_at: now,
    approved_at: existingDevice?.approved_at || now,
    blocked_at: "",
    notes: input.notes,
    created_at: existingDevice?.created_at ?? now,
    updated_at: now,
  }

  await c.devices.updateOne({ product_key: request.product_key, install_id: request.install_id }, { $set: device }, { upsert: true })
  await c.activationRequests.updateOne(
    { id: request.id },
    {
      $set: {
        status: "approved",
        customer_id: customer.id,
        license_id: license.id,
        device_id: device.id,
        notes: input.notes,
        updated_at: now,
      },
    },
  )
  await recordActivity("activation.approved", "activation_request", request.id, `${customer.name} activation approved.`)

  return { customer, license, device }
}

export async function verifyLicense(input: {
  product: string
  client_id?: string
  license_key?: string
  install_id: string
  machine_hash?: string
  app_version: string
  previous_machine_hash?: string
  previous_machine_hashes?: string[]
  fingerprint_source?: string
  fingerprint_version?: number
  stable_fingerprint_migration?: boolean
  rebind_requested?: boolean
  fingerprint_rebind_reason?: string
}) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const checkedAt = nowIso()

  const saveCheck = async (check: Omit<LicenseCheck, "id" | "checked_at">) => {
    const row: LicenseCheck = {
      ...check,
      id: `chk-${randomUUID().slice(0, 10)}`,
      checked_at: checkedAt,
    }
    await c.checks.insertOne(row)
    return row
  }

  if (input.product !== productKey) {
    await saveCheck({
      license_id: "",
      product_key: input.product,
      client_id: input.client_id ?? "",
      install_id: input.install_id,
      app_version: input.app_version,
      status: "invalid",
      valid: false,
      message: "Invalid product.",
    })
    return {
      valid: false,
      allowed: false,
      status: "invalid",
      state: "invalid",
      device_approval: "unknown",
      rebind_performed: false,
      message: "Invalid product.",
    }
  }

  let license: ProductLicense | null = null
  let device: LicenseDevice | null = null
  let rebindPerformed = false

  if (input.license_key && input.client_id) {
    const keyHash = hashLicenseKey(input.license_key)
    const found = await c.licenses.findOne({ product_key: productKey, client_id: input.client_id, license_key_hash: keyHash })
    license = found ? withoutMongoId(found) : null
  } else {
    const foundDevice = await c.devices.findOne({ product_key: productKey, install_id: input.install_id })
    device = foundDevice ? withoutMongoId(foundDevice) : null

    if (!device || device.status === "pending") {
      await saveCheck({
        license_id: "",
        product_key: productKey,
        client_id: device?.customer_id ?? "",
        install_id: input.install_id,
        app_version: input.app_version,
        status: "pending",
        valid: false,
        message: "Device is pending approval.",
      })
      return {
        valid: false,
        allowed: false,
        status: "pending",
        state: "pending",
        device_approval: device?.status ?? "pending",
        rebind_performed: false,
        message: "Device is pending approval.",
      }
    }

    if (device.status === "blocked") {
      await saveCheck({
        license_id: device.license_id,
        product_key: productKey,
        client_id: device.customer_id,
        install_id: input.install_id,
        app_version: input.app_version,
        status: "blocked",
        valid: false,
        message: "Device is blocked. Please contact SparkPair.",
      })
      return {
        valid: false,
        allowed: false,
        status: "blocked",
        state: "blocked",
        device_approval: device.status,
        rebind_performed: false,
        message: "Device is blocked. Please contact SparkPair.",
      }
    }

    const foundLicense = device.license_id ? await c.licenses.findOne({ id: device.license_id }) : null
    license = foundLicense ? withoutMongoId(foundLicense) : null

    if (input.machine_hash && device.machine_hash && input.machine_hash !== device.machine_hash) {
      const previousHashes = [input.previous_machine_hash, ...(input.previous_machine_hashes ?? [])]
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value))
      const migrationRebindAllowed =
        device.status === "approved" &&
        Boolean(license) &&
        license?.id === device.license_id &&
        license?.customer_id === device.customer_id &&
        license?.product_key === productKey &&
        input.fingerprint_source === "stable_install_identity" &&
        input.fingerprint_version === 2 &&
        input.stable_fingerprint_migration === true &&
        input.rebind_requested === true &&
        input.fingerprint_rebind_reason === "stable_install_identity_after_update" &&
        previousHashes.includes(device.machine_hash)

      if (!migrationRebindAllowed) {
        await saveCheck({
          license_id: device.license_id,
          product_key: productKey,
          client_id: device.customer_id,
          install_id: input.install_id,
          app_version: input.app_version,
          status: "invalid",
          valid: false,
          message: "Device identity changed. Please contact SparkPair.",
        })
        return {
          valid: false,
          allowed: false,
          status: "invalid",
          state: "identity_mismatch",
          device_approval: device.status,
          rebind_performed: false,
          message: "Device identity changed. Please contact SparkPair.",
        }
      }

      const reboundLicense = license
      if (!reboundLicense) {
        return {
          valid: false,
          allowed: false,
          status: "invalid",
          state: "identity_mismatch",
          device_approval: device.status,
          rebind_performed: false,
          message: "No approved license is linked to this device.",
        }
      }

      const oldMachineHash = device.machine_hash
      const nextLegacyHashes = Array.from(new Set([...(device.legacy_machine_hashes ?? []), oldMachineHash, ...previousHashes]))
      const now = nowIso()

      await Promise.all([
        c.devices.updateOne(
          { id: device.id, status: "approved", license_id: device.license_id, customer_id: device.customer_id },
          {
            $set: {
              machine_hash: input.machine_hash,
              legacy_machine_hashes: nextLegacyHashes,
              fingerprint_source: input.fingerprint_source,
              fingerprint_version: input.fingerprint_version,
              last_rebind_at: now,
              last_seen_at: now,
              app_version: input.app_version,
              updated_at: now,
            },
          },
        ),
        c.licenses.updateOne(
          { id: reboundLicense.id, customer_id: device.customer_id },
          {
            $set: {
              machine_hash: input.machine_hash,
              legacy_machine_hashes: Array.from(new Set([...(reboundLicense.legacy_machine_hashes ?? []), oldMachineHash, ...previousHashes])),
              updated_at: now,
            },
          },
        ),
        recordActivity("legacy_fingerprint_rebound", "device", device.id, "Legacy device fingerprint rebound to stable install identity.", {
          old_machine_hash: oldMachineHash,
          new_machine_hash: input.machine_hash,
          install_id: input.install_id,
          customer_id: device.customer_id,
          license_id: device.license_id,
          app_version: input.app_version,
          fingerprint_source: input.fingerprint_source,
          fingerprint_version: input.fingerprint_version,
          fingerprint_rebind_reason: input.fingerprint_rebind_reason,
        }),
      ])

      device = {
        ...device,
        machine_hash: input.machine_hash,
        legacy_machine_hashes: nextLegacyHashes,
        fingerprint_source: input.fingerprint_source,
        fingerprint_version: input.fingerprint_version,
        last_rebind_at: now,
        last_seen_at: now,
        app_version: input.app_version,
        updated_at: now,
      }
      license = { ...reboundLicense, machine_hash: input.machine_hash }
      rebindPerformed = true
    }
  }

  if (!license) {
    await saveCheck({
      license_id: "",
      product_key: productKey,
      client_id: input.client_id ?? device?.customer_id ?? "",
      install_id: input.install_id,
      app_version: input.app_version,
      status: "invalid",
      valid: false,
      message: input.license_key ? "License key was not found." : "No approved license is linked to this device.",
    })
    return {
      valid: false,
      allowed: false,
      status: "invalid",
      state: "invalid",
      device_approval: device?.status ?? "unknown",
      rebind_performed: false,
      message: input.license_key ? "License key was not found." : "No approved license is linked to this device.",
    }
  }

  const { status, valid, message } = getLicenseEvaluation(license)

  const boundInstallId = license.install_id || input.install_id
  await c.licenses.updateOne(
    { id: license.id },
    {
      $set: {
          install_id: boundInstallId,
          machine_hash: license.machine_hash || input.machine_hash || "",
          last_check_at: checkedAt,
          updated_at: checkedAt,
      },
    },
  )

  await saveCheck({
    license_id: license.id,
    product_key: productKey,
    client_id: license.client_id,
    install_id: input.install_id,
    app_version: input.app_version,
    status,
    valid,
    message,
  })

  return {
    valid,
    allowed: valid,
    status,
    state: status,
    device_approval: device?.status ?? "key_verified",
    rebind_performed: rebindPerformed,
    client_name: license.client_name,
    expires_at: license.expires_at,
    grace_days: license.grace_days,
    message,
  }
}
