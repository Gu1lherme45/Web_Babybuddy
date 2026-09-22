import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { requestWithCsrf } from '../services/api';
import AuthContext from './AuthContext';
import { normalizeAuthenticatedUser } from './normalizeAuthenticatedUser';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const { data } = await api.get('/api/usuarios/me', { skipAuthRedirect: true });
      const authenticatedUser = normalizeAuthenticatedUser(data);
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 404) throw error;
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    loadSession().finally(() => setLoading(false));
  }, [loadSession]);

  useEffect(() => {
    const clearSession = () => setUser(null);
    window.addEventListener('babybuddy:unauthorized', clearSession);
    return () => window.removeEventListener('babybuddy:unauthorized', clearSession);
  }, []);

  const login = useCallback(async (username, password) => {
    const body = new URLSearchParams({ username: username.trim().toLowerCase(), password });
    await requestWithCsrf({
      method: 'post',
      url: '/login',
      data: body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      skipAuthRedirect: true,
    });
    return loadSession();
  }, [loadSession]);

  const logout = useCallback(async () => {
    try {
      await requestWithCsrf({ method: 'post', url: '/logout', skipAuthRedirect: true });
    } finally {
      setUser(null);
    }
  }, []);

  const register = useCallback(async ({ nome, username, password }) => {
    const { data } = await requestWithCsrf({
      method: 'post',
      url: '/api/usuarios',
      data: { nome, username, password },
      skipAuthRedirect: true,
    });
    return data;
  }, []);

  const updateProfile = useCallback(async (profile) => {
    const { data } = await requestWithCsrf({
      method: 'put',
      url: `/api/usuarios/${user.id}`,
      data: { nome: profile.nome, username: profile.username },
    });
    const updatedUser = normalizeAuthenticatedUser(data);
    setUser(updatedUser);
    return updatedUser;
  }, [user]);

  const changePassword = useCallback(async (password) => {
    await requestWithCsrf({
      method: 'patch',
      url: `/api/usuarios/${user.id}/senha`,
      data: { senha: password },
    });
  }, [user]);

  const deleteAccount = useCallback(async () => {
    await requestWithCsrf({ method: 'delete', url: `/api/usuarios/${user.id}` });
    setUser(null);
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    authenticated: Boolean(user),
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    deleteAccount,
    reloadSession: loadSession,
  }), [user, loading, login, logout, register, updateProfile, changePassword, deleteAccount, loadSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
