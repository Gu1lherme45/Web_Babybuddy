import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as api from '../services/api';
import {
  AUTH_SESSION_KEY,
  clearAuthSession,
  persistAuthSession,
  readAuthSession,
  removeLegacySensitiveStorage,
} from '../services/browserStorage';

const AuthContext = createContext(null);
const HEARTBEAT_INTERVAL_MS = 60 * 1000;

export function AuthProvider({ children }) {
  const [initialSnapshot] = useState(() => readAuthSession());
  const [usuario, setUsuario] = useState(initialSnapshot.session?.user ?? null);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState(
    initialSnapshot.session?.expiresAt ?? null
  );
  const [mensagemSessao, setMensagemSessao] = useState('');
  const lastHeartbeatRef = useRef(0);

  const clearSession = useCallback((message = '') => {
    clearAuthSession();
    setUsuario(null);
    setExpiresAt(null);
    setMensagemSessao(message);
  }, []);

  const saveSession = useCallback((user, resetIssuedAt = false) => {
    const session = persistAuthSession(user, { resetIssuedAt });
    setUsuario(session?.user ?? null);
    setExpiresAt(session?.expiresAt ?? null);
    setMensagemSessao('');
    return session?.user ?? null;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const dados = await api.getMe();
      return saveSession(dados);
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession, saveSession]);

  useEffect(() => {
    removeLegacySensitiveStorage();

    if (initialSnapshot.expired) {
      api.logout().catch(() => {}).finally(() => setLoading(false));
      setMensagemSessao('Sua sessão expirou. Entre novamente.');
      return;
    }

    refresh().finally(() => setLoading(false));
  }, [initialSnapshot.expired, refresh]);

  const entrar = useCallback(
    async (username, password) => {
      await api.login(username, password);
      const dados = await api.getMe();
      return saveSession(dados, true);
    },
    [saveSession]
  );

  const sair = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const expirar = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // A sessão do servidor pode já ter expirado.
    } finally {
      clearSession('Sua sessão expirou após 30 minutos de inatividade.');
    }
  }, [clearSession]);

  useEffect(() => {
    if (!usuario || !expiresAt) return undefined;

    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      expirar();
      return undefined;
    }

    const timeoutId = window.setTimeout(expirar, remaining);
    return () => window.clearTimeout(timeoutId);
  }, [usuario, expiresAt, expirar]);

  useEffect(() => {
    if (!usuario) return undefined;

    const heartbeat = async () => {
      const now = Date.now();
      if (now - lastHeartbeatRef.current < HEARTBEAT_INTERVAL_MS) return;
      lastHeartbeatRef.current = now;
      await refresh();
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') heartbeat();
    };

    window.addEventListener('pointerdown', heartbeat);
    window.addEventListener('keydown', heartbeat);
    window.addEventListener('touchstart', heartbeat, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('pointerdown', heartbeat);
      window.removeEventListener('keydown', heartbeat);
      window.removeEventListener('touchstart', heartbeat);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh, usuario]);

  useEffect(() => {
    const onUnauthorized = () => {
      clearSession('Sua sessão expirou. Entre novamente.');
    };

    const onStorage = (event) => {
      if (event.key !== AUTH_SESSION_KEY) return;

      if (!event.newValue) {
        clearSession('Sua sessão foi encerrada em outra aba.');
        return;
      }

      const snapshot = readAuthSession();

      if (!snapshot.session) {
        clearSession();
        return;
      }

      setUsuario(snapshot.session.user);
      setExpiresAt(snapshot.session.expiresAt);
    };

    window.addEventListener('babybuddy:unauthorized', onUnauthorized);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('babybuddy:unauthorized', onUnauthorized);
      window.removeEventListener('storage', onStorage);
    };
  }, [clearSession]);

  const value = useMemo(
    () => ({
      usuario,
      loading,
      expiresAt,
      mensagemSessao,
      entrar,
      sair,
      refresh,
    }),
    [usuario, loading, expiresAt, mensagemSessao, entrar, sair, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth precisa ser usado dentro de <AuthProvider>');
  }
  return ctx;
}
