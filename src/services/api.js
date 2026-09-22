import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

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

export default api;
