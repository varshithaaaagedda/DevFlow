import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { MOCK_USER } from '../constants/mockData';
import { StorageService } from '../services/StorageService';
import { githubService } from '../services/githubService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsDemoUser: () => Promise<void>;
  loginWithGitHubToken: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkSavedSession();
  }, []);

  const checkSavedSession = async () => {
    try {
      const token = await StorageService.getAuthToken();
      if (token && !token.startsWith('demo_user_token')) {
        // Attempt to fetch real user from GitHub API
        try {
          const ghUser = await githubService.getCurrentUser(token);
          setUser(ghUser);
        } catch (e) {
          // Token expired or invalid fallback to demo user
          setUser(MOCK_USER);
        }
      } else {
        // Default to Demo User
        setUser(MOCK_USER);
        await StorageService.saveAuthToken('demo_user_token_devflow');
      }
    } catch (e) {
      console.warn('Session restoration error:', e);
      setUser(MOCK_USER);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoUser = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    setUser(MOCK_USER);
    await StorageService.saveAuthToken('demo_user_token_devflow');
    setIsLoading(false);
  };

  const loginWithGitHubToken = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await githubService.authenticateWithGitHub(token);
      if (res.success) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error('GitHub token auth error:', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await StorageService.clearSession();
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginAsDemoUser,
        loginWithGitHubToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
