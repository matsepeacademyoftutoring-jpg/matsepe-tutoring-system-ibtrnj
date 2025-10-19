
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock login function - in production, this would call your backend
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', email);
    
    // Mock authentication - determine role based on email
    let role: UserRole = 'student';
    if (email.includes('admin')) role = 'admin';
    else if (email.includes('tutor')) role = 'tutor';
    else if (email.includes('parent')) role = 'parent';
    else if (email.includes('receptionist')) role = 'receptionist';

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    console.log('Logging out');
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
