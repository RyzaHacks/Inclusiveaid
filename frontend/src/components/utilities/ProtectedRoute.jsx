import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          Router.replace('/login');
        } else {
          setIsAuthenticated(true);
        }
      };

      checkAuth();
    }, [Router]);

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    } else {
      return null; // or a loading spinner
    }
  };
};

export default ProtectedRoute;