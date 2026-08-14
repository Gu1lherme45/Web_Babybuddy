import apiClient from '../http/apiClient';

async function listar() {
  const response = await apiClient.get('/api/materiais');
  return response.data;
}

async function buscarPorId(id) {
  const response = await apiClient.get(`/api/materiais/${id}`);
  return response.data;
}

async function criar(material) {
  const response = await apiClient.post('/api/materiais', material);
  return response.data;
}

async function atualizar(id, material) {
  const response = await apiClient.put(`/api/materiais/${id}`, material);
  return response.data;
}

async function ativar(id) {
  await apiClient.patch(`/api/materiais/${id}/ativar`);
}

async function inativar(id) {
  await apiClient.patch(`/api/materiais/${id}/inativar`);
}

async function remover(id) {
  await apiClient.delete(`/api/materiais/${id}`);
}

const MaterialRepository = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  ativar,
  inativar,
  remover,
};

export default MaterialRepository;
