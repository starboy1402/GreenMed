import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'seller' | 'customer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('customer');

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role') as UserRole;
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('role', newUser.role);
      setRole(newUser.role);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('role', newRole);
  };

  const logout = () => {
    setUser(null);
    setRole('customer');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role, 
        setUser: handleSetUser, 
        setRole: handleSetRole, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};