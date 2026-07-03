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
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    })
    global.sparkpairMongoClientPromise = client.connect().catch((error) => {
      global.sparkpairMongoClientPromise = undefined
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
