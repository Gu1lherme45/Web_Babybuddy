import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import apiClient from '../../infrastructure/http/apiClient';
import UsuarioRepository from '../../infrastructure/repositories/UsuarioRepository';

const AuthContext = createContext(undefined);

function montarCredenciais(username, password) {
  const credenciais = new URLSearchParams();
  credenciais.append('username', username);
  credenciais.append('password', password);
  return credenciais;
}

export function AuthProvider({ children }) {
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    UsuarioRepository.buscarMe()
      .then(setUsuarioAtual)
      .catch(() => setUsuarioAtual(null))
      .finally(() => setCarregando(false));
  }, []);

  const login = useCallback(async (username, password) => {
    await apiClient.post('/login', montarCredenciais(username, password));
    const usuario = await UsuarioRepository.buscarMe();
    setUsuarioAtual(usuario);
    return usuario;
  }, []);

  const logout = useCallback(async () => {
    await apiClient.post('/logout');
    setUsuarioAtual(null);
  }, []);

  const value = useMemo(
    () => ({
      usuarioAtual,
      carregando,
      isAdmin: usuarioAtual?.nivelAcesso === 'ADMIN',
      isAuthenticated: usuarioAtual != null,
      login,
      logout,
    }),
    [usuarioAtual, carregando, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
