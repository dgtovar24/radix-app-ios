import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

interface AuthState {
  token: string | null;
  userId: number | null;
  role: string | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    token: null,
    userId: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const [token, userId, role] = await Promise.all([
        SecureStore.getItemAsync('auth_token'),
        SecureStore.getItemAsync('user_id'),
        SecureStore.getItemAsync('user_role'),
      ]);
      setState({ token, userId: userId ? Number(userId) : null, role, loading: false });
    } catch {
      setState({ token: null, userId: null, role: null, loading: false });
    }
  };

  const login = async (token: string, userId: number, role: string) => {
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('user_id', String(userId));
    await SecureStore.setItemAsync('user_role', role);
    setState({ token, userId, role, loading: false });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('user_role');
    setState({ token: null, userId: null, role: null, loading: false });
    router.replace('/login');
  };

  const isAuthenticated = !!state.token;

  return { ...state, login, logout, isAuthenticated, reload: loadAuth };
}