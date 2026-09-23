import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function asApiError(error) {
  if (error instanceof ApiError) return error;
  const status = error.response?.status;
  const payload = error.response?.data;
  const message = payload?.error || payload?.message || (typeof payload === 'string' ? payload : null)
    || error.message || `Erro ${status || 'na requisição'}`;
  return new ApiError(status, message);
}

async function compatibleRequest(request) {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw asApiError(error);
  }
}

async function csrfHeaders() {
  const { data } = await api.get('/api/csrf', { skipAuthRedirect: true });
  return { [data.headerName]: data.token };
}

export async function requestWithCsrf(config) {
  const headers = await csrfHeaders();
  return api.request({ ...config, headers: { ...headers, ...config.headers } });
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url === '/login';
    if (error.response?.status === 401 && !isLogin && !error.config?.skipAuthRedirect) {
      window.dispatchEvent(new CustomEvent('babybuddy:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export function absoluteApiUrl(path) {
  if (!path) return '';
  return /^https?:\/\//i.test(path) ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Compatibilidade para os fluxos de gestante/questionário e para os testes
// existentes na branch conexao-banco. Novos módulos podem usar `api` e
// `requestWithCsrf` diretamente.
export function login(username, password) {
  const data = new URLSearchParams({ username, password });
  return compatibleRequest(() => requestWithCsrf({
    method: 'post',
    url: '/login',
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    skipAuthRedirect: true,
  }));
}

export function logout() {
  return compatibleRequest(() => requestWithCsrf({ method: 'post', url: '/logout', skipAuthRedirect: true }));
}

export function getMe() {
  return compatibleRequest(() => api.get('/api/usuarios/me', { skipAuthRedirect: true }));
}

export function listarUsuarios() {
  return compatibleRequest(() => api.get('/api/usuarios'));
}

export function criarUsuario(dados) {
  return compatibleRequest(() => requestWithCsrf({ method: 'post', url: '/api/usuarios', data: dados }));
}

export function atualizarUsuario(id, dados) {
  return compatibleRequest(() => requestWithCsrf({ method: 'put', url: `/api/usuarios/${id}`, data: dados }));
}

export function trocarSenha(id, novaSenha) {
  return compatibleRequest(() => requestWithCsrf({
    method: 'patch',
    url: `/api/usuarios/${id}/senha`,
    data: { senha: novaSenha },
  }));
}

export function listarGestantes() {
  return compatibleRequest(() => api.get('/api/gestantes'));
}

export function criarGestante(dados) {
  return compatibleRequest(() => requestWithCsrf({ method: 'post', url: '/api/gestantes', data: dados }));
}

export function atualizarGestante(id, dados) {
  return compatibleRequest(() => requestWithCsrf({ method: 'put', url: `/api/gestantes/${id}`, data: dados }));
}

export function criarQuestionario(dados) {
  return compatibleRequest(() => requestWithCsrf({ method: 'post', url: '/api/questionarios', data: dados }));
}

export function listarMateriais() {
  return compatibleRequest(() => api.get('/api/materiais'));
}

export function criarMaterial(dados) {
  return compatibleRequest(() => requestWithCsrf({ method: 'post', url: '/api/materiais', data: dados }));
}

export function atualizarMaterial(id, dados) {
  return compatibleRequest(() => requestWithCsrf({ method: 'put', url: `/api/materiais/${id}`, data: dados }));
}

export function inativarMaterial(id) {
  return compatibleRequest(() => requestWithCsrf({ method: 'patch', url: `/api/materiais/${id}/inativar` }));
}

export function ativarMaterial(id) {
  return compatibleRequest(() => requestWithCsrf({ method: 'patch', url: `/api/materiais/${id}/ativar` }));
}

export function excluirMaterial(id) {
  return compatibleRequest(() => requestWithCsrf({ method: 'delete', url: `/api/materiais/${id}` }));
}

export default api;
