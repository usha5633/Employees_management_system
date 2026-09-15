import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';
import { hashPassword, isPasswordStrongEnough } from '@/lib/auth/password';
import { ok, fail, withErrorHandling } from '@/lib/utils/api-response';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  // Must match a document in the `roles` collection — see scripts/seed.js
  // for the four panel roles this project ships with: admin, hr, manager, employee.
  role: z.enum(['admin', 'hr', 'manager', 'employee']),
});

// POST /api/v1/auth/register
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const body = await req.json();
    const parsed = RegisterSchema.parse(body);

    if (!isPasswordStrongEnough(parsed.password)) {
      return fail(
        'Password must be at least 8 characters and include upper, lower case letters and a number.',
        422
      );
    }

    const db = await getDb();
    const users = db.collection(COLLECTIONS.USERS);

    const existing = await users.findOne({ email: parsed.email.toLowerCase() });
    if (existing) {
      return fail('An account with this email already exists.', 409);
    }

    const now = new Date();
    const result = await users.insertOne({
      email: parsed.email.toLowerCase(),
      passwordHash: hashPassword(parsed.password),
      fullName: parsed.fullName,
      role: parsed.role,
      mfaEnabled: true,
      disabled: false,
      createdAt: now,
      updatedAt: now,
    });

    return ok(
      { userId: result.insertedId.toString(), email: parsed.email.toLowerCase(), role: parsed.role },
      201
    );
  });
}
