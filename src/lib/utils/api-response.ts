import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AuthError } from '@/lib/auth/rbac';

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created(data: unknown) {
  return ok(data, 201);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: { message, details } }, { status });
}

/**
 * Wraps a route handler body, translating known error types (auth, zod
 * validation) into consistent JSON error responses, and logging anything
 * unexpected as a 500 without leaking internals to the client.
 */
export async function withErrorHandling(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) {
      return fail(err.message, err.status);
    }
    if (err instanceof ZodError) {
      return fail('Validation failed', 422, err.flatten());
    }
    console.error('[api] Unhandled error:', err);
    return fail('Internal server error', 500);
  }
}
