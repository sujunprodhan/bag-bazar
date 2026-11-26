import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/getAuthSession';
import {
  getAdminDashboardData,
  getUserDashboardData,
} from '@/actions/server/dashboard';
import AdminDashboardClient from '@/components/dashboard/AdminDashboardClient';
import UserDashboardClient from '@/components/dashboard/UserDashboardClient';

export const metadata = {
  title: 'Dashboard | BagBazar',
  description: 'Manage your BagBazar orders, wishlist, and store.',
};

export default async function DashboardPage({ searchParams }) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const view = resolvedParams?.view;

  if (session.user.role === 'admin' && view !== 'user') {
    const adminData = await getAdminDashboardData();
    return <AdminDashboardClient user={session.user} initialData={adminData} />;
  }

  const userData = await getUserDashboardData();
  return <UserDashboardClient user={session.user} initialData={userData} />;
}
