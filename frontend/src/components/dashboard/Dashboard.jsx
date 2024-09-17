// components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardSidebar from './DashboardSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../../hooks/consolidated/useAuth';
import useDashboard from '../../hooks/consolidated/useDashboard';

import AdminDashboardContent from './admin/AdminDashboardContent';
import ClientDashboardContent from './client/ClientDashboardContent';
import ServiceWorkerDashboardContent from './serviceworker/ServiceWorkerDashboardContent';
import DynamicDashboard from './DynamicDashboard';
import RoleManagement from './admin/RoleManagement';
import UserManagementContent from './admin/UserManagementContent'; // Updated import
import AdminServicesView from './admin/AdminServicesView';
import NDISPlanManagement from './admin/NDISPlanManagement';
import CourseManagementContent from '../course/CourseManagementContent';
import ProfileContent from './ProfileContent';
import ClientServicesView from './client/services/ClientServicesView';
import SupportContent from './client/SupportContent';
import CommunityContent from './client/CommunityContent';
import NDISPlanContent from './client/ndis/NDISPlanContent';
import ZoomContent from '../appointments/ZoomContent';
import MessageCenter from './messagecenter/MessageCenter';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { dashboardData, loading: dashboardLoading, error: dashboardError, refreshDashboard } = useDashboard();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderContent = () => {
    if (loading || !user || !user.role) {
      return <div>Loading user data...</div>;
    }

    if (dashboardLoading) {
      return <div>Loading dashboard data...</div>;
    }

    if (dashboardError) {
      return <div>Error: {dashboardError}</div>;
    }

    switch (activeTab) {
      case 'Dashboard':
        switch (user.role.name) {
          case 'admin':
            return <AdminDashboardContent dashboardData={dashboardData} />;
          case 'client':
            return <ClientDashboardContent userData={user} dashboardData={dashboardData} />;
          case 'service_worker':
            return <ServiceWorkerDashboardContent userData={user} dashboardData={dashboardData} />;
          default:
            return <DynamicDashboard roleName={user.role.name} dashboardData={dashboardData} />;
        }
      case 'Profile':
        return <ProfileContent userData={user} />;
      case 'Role Management':
        return user.role.name === 'admin' ? <RoleManagement /> : null;
      case 'User Management':
        return user.role.name === 'admin' ? <UserManagementContent /> : null; // This now uses our new component
      case 'Service Management':
        return user.role.name === 'admin' ? <AdminServicesView /> : null;
      case 'NDIS Plan Management':
        return user.role.name === 'admin' ? <NDISPlanManagement /> : null;
      case 'Course Management':
        return user.role.name === 'admin' ? <CourseManagementContent /> : null;
      case 'Services':
        return user.role.name === 'client' ? <ClientServicesView userId={user.id} /> : null;
      case 'Support':
        return <SupportContent userData={user} />;
      case 'Community':
        return <CommunityContent userData={user} />;
      case 'NDIS Plan':
        return user.role.name === 'client' ? <NDISPlanContent userData={user} /> : null;
      case 'Zoom Meetings':
        return <ZoomContent userData={user} />;
      case 'Messages':
        return <MessageCenter userRole={user.role.name} userData={user} />;
      default:
        return <div>404: Page not found</div>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`flex h-screen bg-base-200 transition-colors duration-200 ease-in-out ${darkMode ? 'dark' : ''}`}>
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className={`flex flex-col flex-grow ${sidebarCollapsed ? 'ml-16' : 'ml-60'} transition-all duration-300`}>
        <header className="bg-base-100 shadow-lg z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">{activeTab}</h2>
              <div className="flex items-center space-x-6">
                <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
                  {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
                </button>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user?.name || 'User avatar'} />
                      ) : (
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span className="text-xl">{user?.name?.charAt(0) || 'U'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                  <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                    <li><a className="justify-between">Profile <span className="badge">New</span></a></li>
                    <li><a>Settings</a></li>
                    <li><a onClick={handleLogout}>Logout</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-6">
          <div className="container mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-base-100 rounded-xl shadow-xl overflow-hidden p-8"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;