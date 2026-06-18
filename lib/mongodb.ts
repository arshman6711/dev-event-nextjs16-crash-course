import mongoose, { ConnectOptions } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

// Reuse the same cache object across hot reloads in development.
const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
}

global.mongooseCache = cached

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return the existing connection immediately when already connected.
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const options: ConnectOptions = {
      bufferCommands: false,
    }

    // Create one in-flight connection promise and share it across callers.
    cached.promise = mongoose.connect(MONGODB_URI, options)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    // Reset the promise so future calls can retry a failed connection.
    cached.promise = null
    throw error
  }

  return cached.conn
}
