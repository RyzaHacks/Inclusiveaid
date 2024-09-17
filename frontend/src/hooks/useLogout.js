import { useRouter } from 'next/router';

const useLogout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the JWT token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to the login page
    router.push('/login');
  };

  return { handleLogout };
};

export default useLogout;
