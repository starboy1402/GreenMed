import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export type UserRole = 'admin' | 'seller' | 'customer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  applicationStatus?: 'pending' | 'approved' | 'rejected';
  businessName?: string;
  phoneNumber?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token with backend
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = response.data.data;
          setUser(userData);
          setRole(userData.role);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
        }
      }
      setLoading(false);
    };

    checkAuth();
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
      localStorage.removeItem('authToken');
    }
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('role', newRole);
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // Even if logout fails on backend, clear frontend
        console.error('Logout error:', error);
      }
    }
    
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
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};