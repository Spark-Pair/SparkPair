import dns from "node:dns"
import { MongoClient, type Db } from "mongodb"

export const mongoConnectionErrorMessage =
  "MongoDB connection failed. Check MONGODB_URI, Atlas Network Access, DNS SRV, and port 27017."

export class MongoConnectionError extends Error {
  constructor(cause?: unknown) {
    super(mongoConnectionErrorMessage)
    this.name = "MongoConnectionError"
    this.cause = cause
  }
}

declare global {
  var sparkpairMongoClientPromise: Promise<MongoClient> | undefined
  var sparkpairMongoDnsConfigured: boolean | undefined
  var sparkpairMongoDnsLogged: boolean | undefined
}

function sanitizeMongoMessage(message: string) {
  return message
    .replace(/mongodb(\+srv)?:\/\/([^:@/\s]+):([^@/\s]+)@/gi, "mongodb$1://$2:<redacted>@")
    .replace(/(password|pwd)=([^&\s]+)/gi, "$1=<redacted>")
}

function classifyMongoIssue(error: unknown) {
  if (!error || typeof error !== "object") {
    return "unknown"
  }

  const maybeError = error as { code?: unknown; message?: unknown; name?: unknown }
  const code = typeof maybeError.code === "string" ? maybeError.code : ""
  const message = typeof maybeError.message === "string" ? maybeError.message : ""

  if (code === "ENOTFOUND" || code === "ECONNREFUSED" || message.includes("querySrv")) {
    return "dns_or_srv_lookup"
  }

  if (message.includes("bad auth") || message.includes("Authentication failed") || code === "AuthenticationFailed") {
    return "authentication"
  }

  if (message.includes("Server selection timed out") || message.includes("timed out")) {
    return "server_selection_timeout"
  }

  if (code === "MONGODB_URI_MISSING") {
    return "missing_uri"
  }

  if (code === "MONGODB_URI_INVALID") {
    return "malformed_uri"
  }

  return "network_or_atlas_access"
}

function getMongoCauseSummary(error: unknown) {
  if (!error || typeof error !== "object") {
    return String(error)
  }

  const maybeError = error as { code?: unknown; message?: unknown; name?: unknown }
  const parts = [
    typeof maybeError.name === "string" ? maybeError.name : "Error",
    typeof maybeError.code === "string" ? `code=${maybeError.code}` : "",
    typeof maybeError.message === "string" ? sanitizeMongoMessage(maybeError.message) : "",
  ].filter(Boolean)

  return parts.join(": ")
}

function getMongoUriMetadata(uri: string) {
  try {
    const parsed = new URL(uri)
    return {
      scheme: parsed.protocol.replace(":", ""),
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\//, "") || "(default)",
      directConnection: parsed.searchParams.get("directConnection") || "",
      replicaSet: parsed.searchParams.get("replicaSet") || "",
    }
  } catch {
    return {
      scheme: "invalid",
      host: "",
      database: "",
      directConnection: "",
      replicaSet: "",
    }
  }
}

function configureMongoDnsServers() {
  if (global.sparkpairMongoDnsConfigured) {
    return
  }

  global.sparkpairMongoDnsConfigured = true

  const configuredServers = process.env.MONGODB_DNS_SERVERS
  if (!configuredServers) {
    return
  }

  const servers = configuredServers
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean)

  if (!servers.length) {
    return
  }

  dns.setServers(servers)

  if (process.env.NODE_ENV === "development" && !global.sparkpairMongoDnsLogged) {
    global.sparkpairMongoDnsLogged = true
    console.info(`Mongo DNS servers forced: ${servers.join(",")}`)
  }
}

function logMongoConnectionCause(error: unknown, uri?: string) {
  console.error("MongoDB connection failed.", {
    issue: classifyMongoIssue(error),
    cause: getMongoCauseSummary(error),
    ...(uri ? { uri: getMongoUriMetadata(uri) } : {}),
  })
}

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    const error = Object.assign(new Error("MONGODB_URI is missing."), { code: "MONGODB_URI_MISSING" })
    logMongoConnectionCause(error)
    throw new MongoConnectionError(error)
  }

  if (!uri.startsWith("mongodb+srv://") && !uri.startsWith("mongodb://")) {
    const error = Object.assign(new Error("MONGODB_URI must start with mongodb+srv:// or mongodb://."), {
      code: "MONGODB_URI_INVALID",
    })
    logMongoConnectionCause(error, uri)
    throw new MongoConnectionError(error)
  }

  if (!global.sparkpairMongoClientPromise) {
    configureMongoDnsServers()

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    })
    global.sparkpairMongoClientPromise = client.connect().catch((error) => {
      global.sparkpairMongoClientPromise = undefined
      logMongoConnectionCause(error, uri)
      throw new MongoConnectionError(error)
    })
  }

  try {
    return await global.sparkpairMongoClientPromise
  } catch (error) {
    if (error instanceof MongoConnectionError) {
      throw error
    }

    global.sparkpairMongoClientPromise = undefined
    logMongoConnectionCause(error, uri)
    throw new MongoConnectionError(error)
  }
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient()
  return client.db(process.env.MONGODB_DB || "sparkpair")
}

export function isMongoConnectionError(error: unknown) {
  return error instanceof MongoConnectionError
}
