const API_BASE = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseErrorMessage(response) {
  const texto = await response.text();
  if (!texto) return `Erro ${response.status}`;

  try {
    const json = JSON.parse(texto);
    return json.error || json.message || texto;
  } catch {
    return texto;
  }
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  if (response.status === 204) return null;

  const texto = await response.text();
  return texto ? JSON.parse(texto) : null;
}

/* ================= AUTENTICAÇÃO ================= */

export async function login(username, password) {
  const params = new URLSearchParams({ username, password });

  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  return response.json();
}

export function logout() {
  return request('/logout', { method: 'POST' });
}

/* ================= USUÁRIO ================= */

export function getMe() {
  return request('/api/usuarios/me');
}

export function listarUsuarios() {
  return request('/api/usuarios');
}

export function criarUsuario(dados) {
  return request('/api/usuarios', { method: 'POST', body: dados });
}

export function atualizarUsuario(id, dados) {
  return request(`/api/usuarios/${id}`, { method: 'PUT', body: dados });
}

export function trocarSenha(id, novaSenha) {
  return request(`/api/usuarios/${id}/senha`, {
    method: 'PATCH',
    body: { senha: novaSenha },
  });
}

/* ================= GESTANTE ================= */

export function listarGestantes() {
  return request('/api/gestantes');
}

export function criarGestante(dados) {
  return request('/api/gestantes', { method: 'POST', body: dados });
}

export function atualizarGestante(id, dados) {
  return request(`/api/gestantes/${id}`, { method: 'PUT', body: dados });
}

/* ================= QUESTIONÁRIO ================= */

export function criarQuestionario(dados) {
  return request('/api/questionarios', { method: 'POST', body: dados });
}

/* ================= MATERIAL ================= */

export function listarMateriais() {
  return request('/api/materiais');
}

export function criarMaterial(dados) {
  return request('/api/materiais', { method: 'POST', body: dados });
}

export function atualizarMaterial(id, dados) {
  return request(`/api/materiais/${id}`, { method: 'PUT', body: dados });
}

export function inativarMaterial(id) {
  return request(`/api/materiais/${id}/inativar`, { method: 'PATCH' });
}

export function ativarMaterial(id) {
  return request(`/api/materiais/${id}/ativar`, { method: 'PATCH' });
}

export function excluirMaterial(id) {
  return request(`/api/materiais/${id}`, { method: 'DELETE' });
}
