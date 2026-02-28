export interface AdminDashboardStats {
  totalEmisores: number
  activeEmisores: number
  inactiveEmisores: number
  totalUsers: number
  moduleUsageCounts: Record<string, number>
}
