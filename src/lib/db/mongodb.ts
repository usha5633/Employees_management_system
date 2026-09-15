import { MongoClient, Db } from 'mongodb';

/**
 * MongoDB connection singleton for the Node.js serverless runtime.
 *
 * In serverless environments (Vercel), each function invocation can spin up
 * a new execution context, so we cache the client/promise on the global
 * object to reuse connections across warm invocations instead of opening a
 * new connection on every request.
 */

const ATLAS_URI = process.env.MONGODB_URI;
const LOCAL_URI = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/ems_hrms';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ems_hrms';

// Prefer Atlas cloud URI; fall back to local dev instance if not configured.
const CONNECTION_URI = ATLAS_URI && ATLAS_URI.trim().length > 0 ? ATLAS_URI : LOCAL_URI;

interface MongoGlobal {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalForMongo = globalThis as unknown as MongoGlobal;

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(CONNECTION_URI, options);
  return client.connect().catch((err) => {
    console.error(
      `[mongodb] Failed to connect using ${ATLAS_URI ? 'Atlas URI' : 'local fallback URI'}:`,
      err.message
    );
    throw err;
  });
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Reuse the connection across HMR reloads in dev.
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = createClientPromise();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  clientPromise = createClientPromise();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export default clientPromise;
