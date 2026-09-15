/**
 * Maps each account role to the panel route it lands on after login.
 * Keep in sync with scripts/seed.js (which seeds the matching `roles` docs)
 * and the `panel:<segment>` permission convention in rbac.ts.
 */
export const ROLE_PANEL_PATH: Record<string, string> = {
  admin: '/admin/dashboard',
  hr: '/hr',
  manager: '/manager',
  employee: '/employees',
};

export function getPanelPathForRole(role: string): string {
  return ROLE_PANEL_PATH[role] ?? '/login';
}
