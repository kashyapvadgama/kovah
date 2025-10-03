import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client'; // Import our API client

interface AuthContextType {
  token: string | null;
  user: any | null; // We'll type this better later
  isLoading: boolean;
  signIn: (token: string, userData: any) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a saved token when the app starts
    const bootstrapAsync = async () => {
      let userToken: string | null = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          // Here, you could also verify the token with your backend
          // For now, we'll assume it's valid if it exists.
          // We also need to fetch the user profile associated with this token.
          // Let's add a '/me' endpoint to the backend for this.
          const userData = await apiClient('/api/auth/me'); // We'll create this endpoint next
          setUser(userData);
          setToken(userToken);
        }
      } catch (e) {
        console.error("Restoring token failed", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (token: string, userData: any) => {
      setToken(token);
      setUser(userData);
      await AsyncStorage.setItem('userToken', token);
    },
    signOut: async () => {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('userToken');
    },
    token,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

