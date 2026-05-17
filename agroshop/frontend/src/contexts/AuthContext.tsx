'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setToken, removeToken } from '@/lib/api';

interface User { id: string; email: string; name: string; phone?: string; }
interface AuthContextType { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (email: string, password: string, name: string, phone?: string) => Promise<void>; logout: () => void; }

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, login: async () => {}, register: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(u => setUser(u)).catch(() => { removeToken(); setUser(null); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const data = await api.register(email, password, name, phone);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => { removeToken(); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
