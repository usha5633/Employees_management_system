import { requirePanelAccessOrRedirect } from '@/lib/auth/rbac';

// Wraps every page under /employees/** (the employee self-service panel —
// not to be confused with /admin/employees, the admin's employee directory).
export default async function EmployeesLayout({ children }: { children: React.ReactNode }) {
  await requirePanelAccessOrRedirect('employees');
  return <>{children}</>;
}
