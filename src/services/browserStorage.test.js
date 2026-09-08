import { beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_SESSION_KEY,
  MATERIALS_CACHE_KEY,
  SESSION_TTL_MS,
  clearAuthSession,
  persistAuthSession,
  persistMaterialsCache,
  readAuthSession,
  readMaterialsCache,
  removeLegacySensitiveStorage,
} from "./browserStorage";

const USER = {
  id: 7,
  nome: "Lorena Souza",
  username: "lorena@gmail.com",
  nivelAcesso: "Gestante",
  password: "não-pode-ser-persistida",
};

describe("browserStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("espelha somente o usuário sanitizado nos dois storages", () => {
    persistAuthSession(USER, { now: 1_000, resetIssuedAt: true });

    const local = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
    const session = JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY));

    expect(local).toEqual(session);
    expect(local.user.password).toBeUndefined();
    expect(local.expiresAt).toBe(1_000 + SESSION_TTL_MS);
  });

  it("expira e remove a sessão dos dois storages", () => {
    persistAuthSession(USER, { now: 1_000, resetIssuedAt: true });

    expect(readAuthSession(1_000 + SESSION_TTL_MS)).toEqual({
      session: null,
      expired: true,
    });
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it("recupera o espelho de sessao mais recente", () => {
    persistAuthSession(USER, { now: 1_000, resetIssuedAt: true });
    const antigo = sessionStorage.getItem(AUTH_SESSION_KEY);

    persistAuthSession(USER, { now: 2_000 });
    sessionStorage.setItem(AUTH_SESSION_KEY, antigo);

    const { session } = readAuthSession(2_000);
    expect(session.lastActivityAt).toBe(2_000);
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBe(
      localStorage.getItem(AUTH_SESSION_KEY)
    );
  });

  it("espelha materiais e migra a chave antiga", () => {
    const materials = [{ id: 1, titulo: "Sono", rota: "/artigos/sono" }];
    persistMaterialsCache(materials, 2_000);

    expect(readMaterialsCache()).toHaveLength(1);
    expect(localStorage.getItem(MATERIALS_CACHE_KEY)).toBe(
      sessionStorage.getItem(MATERIALS_CACHE_KEY)
    );

    localStorage.removeItem(MATERIALS_CACHE_KEY);
    sessionStorage.removeItem(MATERIALS_CACHE_KEY);
    localStorage.setItem("artigos", JSON.stringify(materials));

    expect(readMaterialsCache()[0].link).toBe("/artigos/sono");
    expect(localStorage.getItem("artigos")).toBeNull();
  });

  it("remove chaves legadas que podiam conter senha", () => {
    localStorage.setItem("usuario", JSON.stringify(USER));
    sessionStorage.setItem("usuarios", JSON.stringify([USER]));

    removeLegacySensitiveStorage();

    expect(localStorage.getItem("usuario")).toBeNull();
    expect(sessionStorage.getItem("usuarios")).toBeNull();
    clearAuthSession();
  });
});
