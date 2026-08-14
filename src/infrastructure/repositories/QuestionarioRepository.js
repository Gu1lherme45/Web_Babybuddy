import apiClient from '../http/apiClient';

async function criar(questionario) {
  const response = await apiClient.post('/api/questionarios', questionario);
  return response.data;
}

async function listar() {
  const response = await apiClient.get('/api/questionarios');
  return response.data;
}

async function buscarPorId(id) {
  const response = await apiClient.get(`/api/questionarios/${id}`);
  return response.data;
}

async function listarPorGestante(gestanteId) {
  const response = await apiClient.get(`/api/questionarios/gestante/${gestanteId}`);
  return response.data;
}

const QuestionarioRepository = {
  criar,
  listar,
  buscarPorId,
  listarPorGestante,
};

export default QuestionarioRepository;
