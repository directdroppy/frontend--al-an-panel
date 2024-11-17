import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { InvestmentsPage } from '@/pages/investments/InvestmentsPage';
import { ReferralsPage } from '@/pages/referrals/ReferralsPage';
import { AchievementsPage } from '@/pages/achievements/AchievementsPage';
import { BalancePage } from '@/pages/dashboard/BalancePage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { useAuth } from '@/lib/auth';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminInvestments } from '@/pages/admin/AdminInvestments';
import { AdminReferrals } from '@/pages/admin/AdminReferrals';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminBalances } from '@/pages/admin/AdminBalances';
import { AdminSettings } from '@/pages/admin/AdminSettings';

export function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Default Route - Redirect based on role */}
      <Route path="/" element={
        <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
      } />

      {/* Protected Dashboard Routes - Only for non-admin users */}
      <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Protected Admin Routes - Only for admin users */}
      <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/investments" element={<AdminInvestments />} />
        <Route path="/admin/referrals" element={<AdminReferrals />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/balances" element={<AdminBalances />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Catch all - Redirect based on role */}
      <Route path="*" element={
        <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
      } />
    </Routes>
  );
}