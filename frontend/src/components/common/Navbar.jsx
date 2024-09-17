import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSun, FaMoon, FaUserCircle } from 'react-icons/fa';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  if (!mounted) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <nav className="mx-auto w-11/12 max-w-7xl mt-6">
        <motion.div 
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center py-4">
              <Link href="/">
                <motion.span 
                  className="text-2xl font-extrabold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  InclusiveAid
                </motion.span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <motion.div key={item.name} whileHover={{ y: -2 }}>
                    <Link href={item.href}>
                      <span className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition duration-300 text-base font-medium">
                        {item.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <motion.button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === 'dark' ? <FaSun className="text-yellow-400 text-lg" /> : <FaMoon className="text-primary-600 text-lg" />}
                </motion.button>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/portal">
                    <span className="btn bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white text-base font-semibold py-2 px-6 rounded-full transition duration-300 shadow-lg hover:shadow-xl flex items-center">
                      <FaUserCircle className="mr-2" />
                      Client Portal
                    </span>
                  </Link>
                </motion.div>
              </div>
              <motion.button 
                className="md:hidden text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
        {/* Mobile menu (you can keep this part as is) */}
      </nav>
    </div>
  );
};

export default Navbar;