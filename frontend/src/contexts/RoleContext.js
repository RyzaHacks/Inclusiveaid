import React from 'react';

const RoleContext = React.createContext(null);

export const RoleProvider = ({ children, role }) => (
  <RoleContext.Provider value={role}>
    {children}
  </RoleContext.Provider>
);

export const useRole = () => React.useContext(RoleContext);
