import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export type UserRole = 'admin' | 'seller' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  // This is the key change: from 'role' to 'userType'
  userType: UserRole; 
  isActive: boolean;
  shopName?: string;
  applicationStatus?: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  // Change from 'role' to 'userType'
  userType: UserRole | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  // Change from 'role' to 'userType'
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = (userData: User | null) => {
    setUserState(userData);
    // Set userType from the user data
    setUserType(userData ? userData.userType : null);
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
    setUser(null);
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userType, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};