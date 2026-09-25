// ProjectWatch: Authentication & Role Provider
// Smart India Hackathon 2026

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { store } from '@/lib/database/store';
import { LoginFormData, RegisterFormData } from '@/lib/validation/schemas';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<UserProfile>;
  register: (data: RegisterFormData) => Promise<UserProfile>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => store.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setUser(store.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const login = async (data: LoginFormData): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      // Simulate network pause
      await new Promise((r) => setTimeout(r, 300));
      const profiles = store.getProfiles();
      const inputEmail = data.email.trim().toLowerCase();
      const matched = profiles.find(
        (p) =>
          p.email.toLowerCase() === inputEmail ||
          (inputEmail.startsWith('citizen@') && p.role === 'citizen') ||
          (inputEmail.startsWith('reviewer@') && p.role === 'reviewer') ||
          (inputEmail.startsWith('admin@') && p.role === 'admin')
      );

      if (!matched) {
        throw new Error('Invalid email or password. Please verify your credentials or use Demo Access.');
      }

      store.setCurrentUser(matched);
      setUser(matched);
      return matched;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const created = store.registerUser({
        role: 'citizen',
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        state: data.state,
        district: data.district,
        constituency: data.constituency,
      });
      setUser(created);
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    store.setCurrentUser(null);
    setUser(null);
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const profiles = store.getProfiles();
    const demoUser = profiles.find((p) => p.role === targetRole);
    if (demoUser) {
      store.setCurrentUser(demoUser);
      setUser(demoUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
