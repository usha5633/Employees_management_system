// import { requirePanelAccessOrRedirect } from '@/lib/auth/rbac';

// // Wraps every page under /hr/**.
// export default async function HrLayout({ children }: { children: React.ReactNode }) {
//   await requirePanelAccessOrRedirect('hr');
//   return <>{children}</>;
// }
import React from 'react';

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}