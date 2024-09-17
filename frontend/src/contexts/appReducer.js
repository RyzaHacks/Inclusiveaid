// appReducer.js

export const initialState = {
    user: null,
    services: [],
    darkMode: false,
    loading: true,
    error: null,
    sidebarCollapsed: false,
};

export const actions = {
  SET_USER: 'SET_USER',
  SET_SERVICES: 'SET_SERVICES',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
};

const appReducer = (state, action) => {
    switch (action.type) {
        case actions.SET_USER:
            return { ...state, user: action.payload };
        case actions.SET_SERVICES:
            return { ...state, services: action.payload };
        case actions.TOGGLE_DARK_MODE:
            return { ...state, darkMode: !state.darkMode };
        case actions.SET_LOADING:
            return { ...state, loading: action.payload };
        case actions.SET_ERROR:
            return { ...state, error: action.payload };
        case actions.TOGGLE_SIDEBAR:
            return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
        default:
            return state;
    }
};

export default appReducer;
