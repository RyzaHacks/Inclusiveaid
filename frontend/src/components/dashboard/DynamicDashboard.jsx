import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import DashboardSidebar from './DashboardSidebar';
import useDashboard from '../../hooks/consolidated/useDashboard';
import useLogout from '../../hooks/useLogout';
import AdminNDISPlanAnalyticsComponent from './admin/components/AdminNDISPlanAnalyticsComponent';
import AdminRecentAppointmentsComponent from './admin/components/AdminRecentAppointmentsComponent';
import AdminSystemHealthComponent from './admin/components/AdminSystemHealthComponent';
import AdminUserActivityComponent from './admin/components/AdminUserActivityComponent';
import AdminServiceUtilizationComponent from './admin/components/AdminServiceUtilizationComponent';
import AdminQuickActionsComponent from './admin/components/AdminQuickActionsComponent';
import AdminReportsComponent from './admin/components/AdminReportsComponent';
import AdminSystemAlertsComponent from './admin/components/AdminSystemAlertsComponent';
import AdminUserGrowthComponent from './admin/components/AdminUserGrowthComponent';
import RoleManagement from './admin/RoleManagement';
import AdminServicesView from './admin/AdminServicesView';
import UserManagementContent from './admin/UserManagementContent';
import NDISPlanManagement from './admin/NDISPlanManagement';
import ServiceCoordinationView from './admin/ServiceCoordinationView';

const componentMap = {
  AdminNDISPlanAnalyticsComponent,
  AdminRecentAppointmentsComponent,
  AdminSystemHealthComponent,
  AdminUserActivityComponent,
  AdminServiceUtilizationComponent,
  AdminQuickActionsComponent,
  AdminReportsComponent,
  AdminSystemAlertsComponent,
  AdminUserGrowthComponent,
};

const DynamicDashboard = ({ roleName, dashboardConfig, user }) => {
  const { dashboardData, loading, error, updateNDISPlan, scheduleService, refreshDashboard } = useDashboard(roleName, dashboardConfig);
  const { handleLogout } = useLogout();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log("DynamicDashboard received dashboardData:", dashboardData);
  }, [dashboardData]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardConfig.components
              .filter(component => dashboardConfig[component.type] !== false && component.enabled)
              .map((component, index) => {
                const Component = componentMap[component.type];
                if (Component) {
                  const componentData = dashboardData ? dashboardData[component.type.toLowerCase()] : null;
                  console.log(`Rendering ${component.type} with data:`, componentData);
                  return (
                    <div key={index} className="4">
                      <Component data={componentData} />
                    </div>
                  );
                } else {
                  console.warn(`Unknown component type: ${component.type}`);
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-4">
                      <h2 className="text-lg font-semibold mb-2">{component.type}</h2>
                      <p>Unknown component type</p>
                    </div>
                  );
                }
              })}
          </div>
        );
      case 'Role Management':
        return user.role.name === 'admin' ? <RoleManagement /> : null;
      case 'User Management':
        return user.role.name === 'admin' ? <UserManagementContent /> : null;
      case 'Service Management':
        return user.role.name === 'admin' ? <AdminServicesView /> : null;
      case 'NDIS Plan Management':
        return user.role.name === 'admin' ? <NDISPlanManagement /> : null;
      case 'Service Coordination':
        return user.role.name === 'admin' ? <ServiceCoordinationView /> : null;
      default:
        return null;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-error shadow-lg m-4">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  );

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
                <button onClick={refreshDashboard} className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-6">
          <div className="container mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DynamicDashboard;