import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import * as HiIcons from 'react-icons/hi';
import * as FaIcons from 'react-icons/fa';

const DashboardSidebar = ({ user, activeTab, setActiveTab, collapsed, toggleSidebar }) => {
  const router = useRouter();

  useEffect(() => {
    console.log('User object in DashboardSidebar:', user);
    if (user && user.role) {
      console.log('Role in DashboardSidebar:', user.role);
      console.log('Sidebar Items in DashboardSidebar:', user.role.sidebarItems);
    } else {
      console.warn('User or user role is missing in DashboardSidebar');
    }
  }, [user]);

const getNavItems = () => {
  if (!user || !user.role || !user.role.sidebarItems) {
    console.error('Sidebar items are missing or undefined');
    return [];
  }

  return user.role.sidebarItems.map((item) => {
    const Icon = HiIcons[item.icon] || FaIcons[item.icon] || FaIcons.FaQuestionCircle;
    return {
      name: item.name,
      icon: Icon,
      color: item.color || 'text-gray-500',
    };
  });
};

  const navItems = getNavItems();

  const sidebarVariants = {
    expanded: { width: '240px', transition: { duration: 0.3 } },
    collapsed: { width: '80px', transition: { duration: 0.3 } },
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 h-screen fixed left-0 top-0 flex flex-col shadow-xl z-20 transition-all duration-300"
      initial={false}
      animate={collapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          >
            InclusiveAid
          </motion.span>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {collapsed ? <HiIcons.HiChevronRight size={24} /> : <HiIcons.HiChevronLeft size={24} />}
        </motion.button>
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <nav className="p-4 space-y-2">
          {navItems.length > 0 ? (
            navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.name
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05, x: collapsed ? 0 : 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`w-6 h-6 ${collapsed ? 'mx-auto' : 'mr-3'}`}
                  whileHover={{ rotate: 10 }}
                >
                  <item.icon className={`w-full h-full ${activeTab === item.name ? 'text-white' : item.color}`} />
                </motion.div>
                {!collapsed && (
                  <motion.span
                    className="font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </motion.button>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No menu items available</div>
          )}
        </nav>
      </div>

      <div className="p-4 border-t dark:border-gray-600">
        <motion.button
          className="flex items-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.05, x: collapsed ? 0 : 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`w-6 h-6 ${collapsed ? 'mx-auto' : 'mr-3'}`}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <HiIcons.HiCog className="w-full h-full text-gray-500" />
          </motion.div>
          {!collapsed && <span className="font-medium">Settings</span>}
        </motion.button>
        <motion.button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 mt-2"
          whileHover={{ scale: 1.05, x: collapsed ? 0 : 5 }}
          whileTap={{ scale: 0.95 }}
        >
<motion.div
            className={`w-6 h-6 ${collapsed ? 'mx-auto' : 'mr-3'}`}
            whileHover={{ x: [0, 5, 0], transition: { repeat: Infinity, duration: 1 } }}
          >
            <HiIcons.HiLogout className="w-full h-full text-red-500" />
          </motion.div>
          {!collapsed && <span className="font-medium">Logout</span>}
        </motion.button>
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400"
        >
          © {new Date().getFullYear()} InclusiveAid
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardSidebar;