"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Mock User Type
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  reload: () => Promise<void>;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => { },
  signOut: async () => { },
  sendEmailVerification: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking for a session
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Re-attach methods that are lost during JSON serialization
      setUser({
        ...parsedUser,
        reload: async () => { console.log('Reloading user...'); },
      });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const mockUser: MockUser = {
      uid: 'mock-user-123',
      email: email,
      displayName: email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      emailVerified: false,
      reload: async () => { console.log('Reloading user...'); }
    };

    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/profile'); // Redirect to profile or dashboard
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('mock_user');
    setLoading(false);
    router.push('/');
  };

  const sendEmailVerification = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Mock email verification sent');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, sendEmailVerification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
