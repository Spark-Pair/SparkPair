import { createHash, randomBytes, randomUUID } from "crypto"
import { getMongoDb } from "@/lib/mongodb"

export const productKey = "garmentsos-pro"
export const productName = "GarmentsOS PRO"

export type ReleaseChannel = "stable" | "beta" | "dev"
export type CustomerStatus = "active" | "inactive"
export type LicenseStatus = "active" | "suspended" | "expired"

export interface Product {
  id: string
  product_key: string
  name: string
  default_channel: ReleaseChannel
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
  version: string
  channel: ReleaseChannel
  mandatory: boolean
  released_at: string
  package_file: string
  package_url: string
  package_sha256: string
  setup_url: string
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
  install_id: string
  notes: string
  last_check_at: string
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

export interface LicenseCreateResult {
  license: ProductLicense
  plain_key?: string
}

const channels: ReleaseChannel[] = ["stable", "beta", "dev"]
const nowIso = () => new Date().toISOString()

async function collections() {
  const db = await getMongoDb()
  return {
    products: db.collection<Product>("products"),
    customers: db.collection<Customer>("customers"),
    releases: db.collection<ProductRelease>("product_releases"),
    licenses: db.collection<ProductLicense>("licenses"),
    checks: db.collection<LicenseCheck>("license_checks"),
  }
}

let indexesPromise: Promise<void> | null = null

export async function ensureGarmentsOsProData() {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const c = await collections()
      await Promise.all([
        c.products.createIndex({ product_key: 1 }, { unique: true }),
        c.releases.createIndex({ product_key: 1, channel: 1, version: 1 }, { unique: true }),
        c.releases.createIndex({ product_key: 1, channel: 1, is_latest: 1 }),
        c.licenses.createIndex({ product_key: 1, client_id: 1 }),
        c.licenses.createIndex({ license_key_hash: 1 }),
        c.checks.createIndex({ license_id: 1, checked_at: -1 }),
        c.checks.createIndex({ product_key: 1, client_id: 1, checked_at: -1 }),
      ])

      const now = nowIso()
      await c.products.updateOne(
        { product_key: productKey },
        {
          $setOnInsert: {
            id: "prod-garmentsos-pro",
            product_key: productKey,
            name: productName,
            default_channel: "stable",
            created_at: now,
          },
          $set: {
            updated_at: now,
          },
        },
        { upsert: true },
      )
    })()
  }

  await indexesPromise
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

export async function getProducts() {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.products.find({}).sort({ name: 1 }).toArray()).map(withoutMongoId)
}

export async function getProduct(product_key = productKey) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const product = await c.products.findOne({ product_key })
  return product ? withoutMongoId(product) : null
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
  return customer
}

export async function getReleases() {
  await ensureGarmentsOsProData()
  const c = await collections()
  const releases = (await c.releases.find({ product_key: productKey }).sort({ released_at: -1 }).toArray()).map(withoutMongoId)
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

export async function getLatestRelease(channel: ReleaseChannel) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const latest = await c.releases.findOne(
    { product_key: productKey, channel, is_published: true, is_latest: true },
    { sort: { released_at: -1 } },
  )

  if (latest) {
    return withoutMongoId(latest)
  }

  const fallback = await c.releases.findOne({ product_key: productKey, channel, is_published: true }, { sort: { released_at: -1 } })
  return fallback ? withoutMongoId(fallback) : null
}

export async function saveRelease(
  input: Omit<ProductRelease, "id" | "product_key" | "created_at" | "updated_at">,
  id?: string,
) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const existing = id ? await c.releases.findOne({ id }) : null
  const now = nowIso()
  const release: ProductRelease = {
    ...input,
    id:
      existing?.id ??
      `rel-${productKey}-${input.version.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${input.channel}`,
    product_key: productKey,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  if (release.is_latest) {
    await c.releases.updateMany({ product_key: productKey, channel: release.channel }, { $set: { is_latest: false } })
  }

  await c.releases.updateOne(
    { product_key: productKey, channel: release.channel, version: release.version },
    { $set: release },
    { upsert: true },
  )
  return release
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
}) {
  await ensureGarmentsOsProData()
  const c = await collections()
  const existing = await c.releases.findOne({ product_key: productKey, version: input.version, channel: input.channel })

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
      notes: input.notes,
      is_published: true,
      is_latest: true,
    },
    existing?.id,
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
    install_id: input.install_id.trim(),
    last_check_at: existing?.last_check_at ?? "",
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  await c.licenses.updateOne({ id: license.id }, { $set: license }, { upsert: true })
  return { license, plain_key: plainKey || undefined }
}

export async function getLicenseChecks(license_id?: string) {
  await ensureGarmentsOsProData()
  const c = await collections()
  return (await c.checks.find(license_id ? { license_id } : {}).sort({ checked_at: -1 }).toArray()).map(withoutMongoId)
}

export async function verifyLicense(input: {
  product: string
  client_id: string
  license_key: string
  install_id: string
  app_version: string
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
      client_id: input.client_id,
      install_id: input.install_id,
      app_version: input.app_version,
      status: "invalid",
      valid: false,
      message: "Invalid product.",
    })
    return { valid: false, status: "invalid", message: "Invalid product." }
  }

  const keyHash = hashLicenseKey(input.license_key)
  const license = await c.licenses.findOne({ product_key: productKey, client_id: input.client_id, license_key_hash: keyHash })

  if (!license) {
    await saveCheck({
      license_id: "",
      product_key: productKey,
      client_id: input.client_id,
      install_id: input.install_id,
      app_version: input.app_version,
      status: "invalid",
      valid: false,
      message: "License key was not found.",
    })
    return { valid: false, status: "invalid", message: "License key was not found." }
  }

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

  const boundInstallId = license.install_id || input.install_id
  await c.licenses.updateOne(
    { id: license.id },
    {
      $set: {
        install_id: boundInstallId,
        last_check_at: checkedAt,
        updated_at: checkedAt,
      },
    },
  )

  await saveCheck({
    license_id: license.id,
    product_key: productKey,
    client_id: input.client_id,
    install_id: input.install_id,
    app_version: input.app_version,
    status,
    valid,
    message,
  })

  return {
    valid,
    status,
    client_name: license.client_name,
    expires_at: license.expires_at,
    grace_days: license.grace_days,
    message,
  }
}
