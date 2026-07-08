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

function getMongoCauseSummary(error: unknown) {
  if (!error || typeof error !== "object") {
    return String(error)
  }

  const maybeError = error as { code?: unknown; message?: unknown; name?: unknown }
  const parts = [
    typeof maybeError.name === "string" ? maybeError.name : "Error",
    typeof maybeError.code === "string" ? `code=${maybeError.code}` : "",
    typeof maybeError.message === "string" ? maybeError.message : "",
  ].filter(Boolean)

  return parts.join(": ")
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

function logMongoConnectionCause(error: unknown) {
  console.error(`MongoDB connection failed cause: ${getMongoCauseSummary(error)}`)
}

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new MongoConnectionError(new Error("MONGODB_URI is missing."))
  }

  if (!uri.startsWith("mongodb+srv://") && !uri.startsWith("mongodb://")) {
    throw new MongoConnectionError(new Error("MONGODB_URI must start with mongodb+srv:// or mongodb://."))
  }

  if (!global.sparkpairMongoClientPromise) {
    configureMongoDnsServers()

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    })
    global.sparkpairMongoClientPromise = client.connect().catch((error) => {
      global.sparkpairMongoClientPromise = undefined
      logMongoConnectionCause(error)
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
    logMongoConnectionCause(error)
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
