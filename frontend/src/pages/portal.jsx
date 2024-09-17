import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DynamicDashboard from '../components/dashboard/DynamicDashboard';
import { useAuth } from '../hooks/consolidated/useAuth';
import useDynamicDashboard from '../hooks/useDynamicDashboard';

const Portal = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { dashboardConfig, loading: dashboardLoading, error } = useDynamicDashboard(user?.role?.name);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return isAuthenticated && user ? (
    <DynamicDashboard roleName={user.role?.name} dashboardConfig={dashboardConfig} user={user} />
  ) : null;
};

export default Portal;
