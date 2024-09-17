import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

const useDarkMode = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  return { darkMode: state.darkMode, toggleDarkMode };
};

export default useDarkMode;
