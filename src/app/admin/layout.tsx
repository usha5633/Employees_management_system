import { requirePanelAccessOrRedirect } from '@/lib/auth/rbac';

// Wraps every page under /admin/**. Runs on the server before any client
// page code, so unauthenticated/unauthorized users never see admin UI or
// its data — they're redirected before render.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePanelAccessOrRedirect('admin');
  return <>{children}</>;
}
