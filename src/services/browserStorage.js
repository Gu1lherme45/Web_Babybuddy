export const AUTH_SESSION_KEY = "babybuddy.auth.v1";
export const MATERIALS_CACHE_KEY = "babybuddy.materials.v1";
export const SESSION_TTL_MS = 30 * 60 * 1000;

const STORAGE_VERSION = 1;

function storages() {
  if (typeof window === "undefined") return [];
  return [window.localStorage, window.sessionStorage];
}

function parse(storage, key) {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeBoth(key, value) {
  const serialized = JSON.stringify(value);

  for (const storage of storages()) {
    try {
      storage.setItem(key, serialized);
    } catch {
      // Cache local é auxiliar. A indisponibilidade/quota do navegador não
      // pode impedir a persistência oficial no backend.
    }
  }
}

function removeBoth(key) {
  for (const storage of storages()) {
    try {
      storage.removeItem(key);
    } catch {
      // Storage pode estar bloqueado por política de privacidade do navegador.
    }
  }
}

export function sanitizeUser(user) {
  if (!user?.id || !user?.username) return null;

  return {
    id: user.id,
    nome: user.nome ?? "",
    username: user.username,
    nivelAcesso: user.nivelAcesso ?? "Gestante",
    statusUsuario: user.statusUsuario,
  };
}

export function clearAuthSession() {
  removeBoth(AUTH_SESSION_KEY);
}

export function readAuthSession(now = Date.now()) {
  if (typeof window === "undefined") {
    return { session: null, expired: false };
  }

  const candidates = [
    parse(window.sessionStorage, AUTH_SESSION_KEY),
    parse(window.localStorage, AUTH_SESSION_KEY),
  ];
  const session = candidates
    .filter(
      (candidate) =>
        candidate?.version === STORAGE_VERSION &&
        sanitizeUser(candidate.user) &&
        Number.isFinite(candidate.expiresAt)
    )
    .sort((left, right) => right.expiresAt - left.expiresAt)[0];

  if (!session) return { session: null, expired: false };

  if (session.expiresAt <= now) {
    clearAuthSession();
    return { session: null, expired: true };
  }

  // Repara automaticamente o espelho caso apenas um dos storages exista.
  writeBoth(AUTH_SESSION_KEY, session);
  return { session, expired: false };
}

export function persistAuthSession(user, options = {}) {
  const safeUser = sanitizeUser(user);
  if (!safeUser) {
    clearAuthSession();
    return null;
  }

  const now = options.now ?? Date.now();
  const previous = readAuthSession(now).session;
  const session = {
    version: STORAGE_VERSION,
    user: safeUser,
    issuedAt: options.resetIssuedAt
      ? now
      : previous?.issuedAt ?? now,
    lastActivityAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  writeBoth(AUTH_SESSION_KEY, session);
  return session;
}

export function removeLegacySensitiveStorage() {
  if (typeof window === "undefined") return;

  // A branch main armazenava usuário e senha nessas chaves.
  for (const storage of storages()) {
    try {
      storage.removeItem("usuario");
      storage.removeItem("usuarios");
    } catch {
      // Ignora storages indisponíveis.
    }
  }
}

function normalizeMaterial(material) {
  return {
    id: material.id,
    titulo: material.titulo ?? "",
    categoria: material.categoria ?? "",
    descricao: material.descricao ?? "",
    arquivo: material.arquivo ?? material.imagem ?? null,
    link: material.link ?? material.rota ?? "/",
    autor: material.autor ?? "",
    statusMaterial:
      material.statusMaterial ??
      (material.status === "suspenso" ? "INATIVO" : "ATIVO"),
  };
}

export function persistMaterialsCache(materials, now = Date.now()) {
  const cache = {
    version: STORAGE_VERSION,
    updatedAt: now,
    items: Array.isArray(materials) ? materials.map(normalizeMaterial) : [],
  };

  writeBoth(MATERIALS_CACHE_KEY, cache);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("babybuddy:materials-updated", { detail: cache })
    );
  }

  return cache;
}

export function readMaterialsCache() {
  if (typeof window === "undefined") return [];

  const candidates = [
    parse(window.sessionStorage, MATERIALS_CACHE_KEY),
    parse(window.localStorage, MATERIALS_CACHE_KEY),
  ];
  const cache = candidates
    .filter(
      (candidate) =>
        candidate?.version === STORAGE_VERSION && Array.isArray(candidate.items)
    )
    .sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0))[0];

  if (cache) {
    writeBoth(MATERIALS_CACHE_KEY, cache);
    return cache.items;
  }

  // Migração compatível com a chave antiga da main.
  const legacy = parse(window.localStorage, "artigos");
  if (Array.isArray(legacy)) {
    const migrated = persistMaterialsCache(legacy).items;
    try {
      window.localStorage.removeItem("artigos");
    } catch {
      // Ignora storage indisponível.
    }
    return migrated;
  }

  return [];
}
