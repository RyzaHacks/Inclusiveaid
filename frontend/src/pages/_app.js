import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Navbar from '../components/common/Navbar'; 
import Footer from '../components/common/Footer'; 
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { RoleProvider } from '../contexts/RoleContext';
import { AppProvider } from '../contexts/AppContext';
import { useAuth } from '../hooks/consolidated/useAuth'; // Updated import path

const queryClient = new QueryClient();

function MyApp({ Component, pageProps, router }) {
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated, user, login, logout } = useAuth(); // Use the useAuth hook
    const routerInstance = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isAuthenticated && routerInstance.pathname.startsWith('/portal')) {
            routerInstance.push('/login');
        }
    }, [isAuthenticated, routerInstance]);

    const isNavbarHidden = routerInstance.pathname === '/portal';
    const isFooterHidden = routerInstance.pathname === '/portal';

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <RoleProvider role={user?.role?.name}>
                    <AppProvider>
                        <div className="min-h-screen bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden flex flex-col">
                            {!isNavbarHidden && <Navbar isAuthenticated={isAuthenticated} userRole={user?.role?.name} logout={logout} />}
                            <motion.main 
                                className={`flex-grow ${isNavbarHidden ? '' : 'pt-24'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <Component {...pageProps} key={router.route} login={login} />
                                </AnimatePresence>
                            </motion.main>
                            {!isFooterHidden && <Footer />}
                        </div>
                    </AppProvider>
                </RoleProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default MyApp;