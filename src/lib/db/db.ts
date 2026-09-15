import { MongoClient, Db, GridFSBucket } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ems_hrms';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const dbClient = await clientPromise;
  return dbClient.db();
}

export async function getGridFSBucket(): Promise<GridFSBucket> {
  const db = await getDatabase();
  return new GridFSBucket(db, { bucketName: 'documents' });
}