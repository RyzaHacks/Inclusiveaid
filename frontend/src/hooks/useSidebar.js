import { useAppContext } from '../contexts/AppContext';

const useSidebar = () => {
  const { state, dispatch } = useAppContext();

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return { sidebarCollapsed: state.sidebarCollapsed, toggleSidebar };
};

export default useSidebar;
