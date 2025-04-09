import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as api from  '@/api';
import {User} from "next-auth";
import { useSession } from 'next-auth/react';
interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();
    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (status === 'authenticated' && session) {
                try {
                    const response = await api.getCurrentUser();
                    if (response?.data) {
                        setUser(response.data);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, [session, status]);
    
      const checkAuth = async () => {
        try {
          const response = await api.getCurrentUser();
          if (response?.success) {
            setUser(response.data as User);
            setIsAuthenticated(true);
              console.log("CHECK AUTH: ", response)


          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      if (loading) {
        return null;
      }

    const login = async (email: string, password: string) => {
        try {
            const response = await api.login(email, password);
            if (response.success) {
                console.log(response)
                setUser(response.data.user);
                setIsAuthenticated(true);

                router.push('/profile'); // or wherever you want to redirect after login
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.logout();
            setUser(null);
            setIsAuthenticated(false);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}