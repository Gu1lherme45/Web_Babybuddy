import apiClient from '../http/apiClient';

async function criar(usuario) {
  const response = await apiClient.post('/api/usuarios', usuario);
  return response.data;
}

async function buscarMe() {
  const response = await apiClient.get('/api/usuarios/me');
  return response.data;
}

async function listar() {
  const response = await apiClient.get('/api/usuarios');
  return response.data;
}

async function buscarPorId(id) {
  const response = await apiClient.get(`/api/usuarios/${id}`);
  return response.data;
}

async function atualizar(id, usuario) {
  const response = await apiClient.put(`/api/usuarios/${id}`, usuario);
  return response.data;
}

async function trocarSenha(id, senha) {
  await apiClient.patch(`/api/usuarios/${id}/senha`, { senha });
}

async function inativar(id) {
  await apiClient.patch(`/api/usuarios/${id}/inativar`);
}

async function remover(id) {
  await apiClient.delete(`/api/usuarios/${id}`);
}

const UsuarioRepository = {
  criar,
  buscarMe,
  listar,
  buscarPorId,
  atualizar,
  trocarSenha,
  inativar,
  remover,
};

export default UsuarioRepository;
