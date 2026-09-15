import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ems_hrms';
const DB_NAME = 'ems_hrms';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let dbInstance: Db;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

/**
 * Returns the native MongoDB Database Instance
 */
export async function getDatabase(): Promise<Db> {
  if (!dbInstance) {
    const connectedClient = await clientPromise;
    dbInstance = connectedClient.db(DB_NAME);
  }
  return dbInstance;
}

/**
 * Initializes Compound Indexes & Multi-Tenant Rules
 */
export async function setupDatabaseIndexes() {
  const db = await getDatabase();

  // 1. Users Collection Indexes
  await db.collection('users').createIndex({ tenantId: 1, email: 1 }, { unique: true });

  // 2. Auth Sessions Fast Token Lookup & Auto Expiry (TTL)
  await db.collection('auth_sessions').createIndex({ token: 1 }, { unique: true });
  await db.collection('auth_sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  // 3. Attendance Compound Indexing
  await db.collection('attendance').createIndex({ tenantId: 1, userId: 1, date: -1 });

  // 4. Notifications Indexing
  await db.collection('notifications').createIndex({ tenantId: 1, userId: 1, createdAt: -1 });

  // 5. Audit Logs Indexing
  await db.collection('audit_logs').createIndex({ tenantId: 1, timestamp: -1 });

  console.log('Database indexes & multi-tenant isolation initialized successfully.');
}