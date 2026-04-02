import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterData } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const tokens = localStorage.getItem('tokens');
      if (tokens) {
        try {
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const tokens = await authApi.login(credentials);
    localStorage.setItem('tokens', JSON.stringify(tokens));
    const userData = await authApi.getProfile();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (data: RegisterData) => {
    const { user: userData, tokens } = await authApi.register(data);
    localStorage.setItem('tokens', JSON.stringify(tokens));
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      const tokens = localStorage.getItem('tokens');
      if (tokens) {
        const { refresh } = JSON.parse(tokens);
        await authApi.logout(refresh);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
