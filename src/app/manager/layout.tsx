// import { requirePanelAccessOrRedirect } from '@/lib/auth/rbac';

// // Wraps every page under /manager/**.
// export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
//   await requirePanelAccessOrRedirect('manager');
//   return <>{children}</>;
// }
import React from 'react';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}