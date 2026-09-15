// /**
//  * Seeds the four panel roles (admin, hr, manager, employee) and a
//  * super-admin user into a fresh database. Run with: npm run seed
//  * (loads .env.local via `-r dotenv/config`, see package.json script)
//  */
// const { MongoClient } = require('mongodb');
// const crypto = require('crypto');

// const ATLAS_URI = process.env.MONGODB_URI;
// const LOCAL_URI = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/ems_hrms';
// const DB_NAME = process.env.MONGODB_DB_NAME || 'ems_hrms';
// const URI = ATLAS_URI && ATLAS_URI.trim().length > 0 ? ATLAS_URI : LOCAL_URI;

// const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
// const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123';

// const ITERATIONS = parseInt(process.env.PBKDF2_ITERATIONS || '210000', 10);
// const KEYLEN = parseInt(process.env.PBKDF2_KEYLEN || '64', 10);
// const DIGEST = process.env.PBKDF2_DIGEST || 'sha256';

// function hashPassword(plain) {
//   const salt = crypto.randomBytes(16).toString('hex');
//   const hash = crypto.pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
//   return `pbkdf2$${ITERATIONS}$${DIGEST}$${salt}$${hash}`;
// }

// // One role per panel. "panel:<segment>" matches the src/app/<segment> route
// // that each layout guard protects (see src/lib/auth/rbac.ts).
// const DEFAULT_ROLES = [
//   { name: 'admin', description: 'Full system access', permissions: ['*'] },
//   { name: 'hr', description: 'HR panel access', permissions: ['panel:hr'] },
//   { name: 'manager', description: 'Manager panel access', permissions: ['panel:manager'] },
//   { name: 'employee', description: 'Employee self-service panel access', permissions: ['panel:employees'] },
// ];

// async function main() {
//   const client = new MongoClient(URI);
//   await client.connect();
//   const db = client.db(DB_NAME);

//   for (const role of DEFAULT_ROLES) {
//     await db
//       .collection('roles')
//       .updateOne(
//         { name: role.name },
//         { $setOnInsert: { ...role, createdAt: new Date(), updatedAt: new Date() } },
//         { upsert: true }
//       );
//   }
//   console.log(`Seeded ${DEFAULT_ROLES.length} roles: ${DEFAULT_ROLES.map((r) => r.name).join(', ')}`);

//   const existingAdmin = await db.collection('users').findOne({ email: ADMIN_EMAIL });
//   if (!existingAdmin) {
//     await db.collection('users').insertOne({
//       email: ADMIN_EMAIL,
//       passwordHash: hashPassword(ADMIN_PASSWORD),
//       fullName: 'System Administrator',
//       role: 'admin',
//       mfaEnabled: true,
//       disabled: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     console.log(`Created admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD} (change immediately)`);
//   } else {
//     console.log(`Admin user ${ADMIN_EMAIL} already exists — skipped.`);
//   }

//   await client.close();
// }

// main().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
/**
 * Seeds the four panel roles (admin, hr, manager, employee) and a
 * super-admin user into a fresh database. Run with: npm run seed
 * (loads .env.local via `-r dotenv/config`, see package.json script)
 */
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const ATLAS_URI = process.env.MONGODB_URI;
const LOCAL_URI = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/ems_hrms';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ems_hrms';
const URI = ATLAS_URI && ATLAS_URI.trim().length > 0 ? ATLAS_URI : LOCAL_URI;

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123';

const ITERATIONS = parseInt(process.env.PBKDF2_ITERATIONS || '210000', 10);
const KEYLEN = parseInt(process.env.PBKDF2_KEYLEN || '32', 10); // Changed from 64 to 32
const DIGEST = process.env.PBKDF2_DIGEST || 'sha256';

function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return `pbkdf2$${ITERATIONS}$${DIGEST}$${salt}$${hash}`;
}

// One role per panel. "panel:<segment>" matches the src/app/<segment> route
const DEFAULT_ROLES = [
  { name: 'admin', description: 'Full system access', permissions: ['*'] },
  { name: 'hr', description: 'HR panel access', permissions: ['panel:hr'] },
  { name: 'manager', description: 'Manager panel access', permissions: ['panel:manager'] },
  { name: 'employee', description: 'Employee self-service panel access', permissions: ['panel:employees'] },
];

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB_NAME);

  for (const role of DEFAULT_ROLES) {
    await db
      .collection('roles')
      .updateOne(
        { name: role.name },
        { $setOnInsert: { ...role, createdAt: new Date(), updatedAt: new Date() } },
        { upsert: true }
      );
  }
  console.log(`Seeded ${DEFAULT_ROLES.length} roles: ${DEFAULT_ROLES.map((r) => r.name).join(', ')}`);

  // Force update or insert admin user with matching password format
  const adminData = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    passwordHash: hashPassword(ADMIN_PASSWORD),
    fullName: 'System Administrator',
    role: 'admin',
    mfaEnabled: false,
    disabled: false,
    updatedAt: new Date(),
  };

  await db.collection('users').updateOne(
    { email: ADMIN_EMAIL },
    { 
      $set: adminData,
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );

  console.log(`Admin user seeded successfully: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});