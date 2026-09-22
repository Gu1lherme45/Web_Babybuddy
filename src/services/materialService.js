import api, { requestWithCsrf } from './api';

export async function listPublicMaterials() {
  const { data } = await api.get('/api/materiais');
  return data;
}

export async function getPublicMaterial(id) {
  const { data } = await api.get(`/api/materiais/${id}`);
  return data;
}

export async function listAdminMaterials() {
  const { data } = await api.get('/api/admin/materiais');
  return data;
}

export async function listMaterialCategories() {
  const { data } = await api.get('/api/categorias-materiais');
  return data;
}

export async function createMaterialCategory(nome) {
  const { data } = await requestWithCsrf({ method: 'post', url: '/api/categorias-materiais', data: { nome } });
  return data;
}

export async function createMaterial(metadata, articleFile, image, progressOrLegacyCover, onUploadProgress) {
  const progress = typeof image === 'function' ? image : (typeof progressOrLegacyCover === 'function' ? progressOrLegacyCover : onUploadProgress);
  const imageFile = typeof image === 'function' ? null : image;
  const body = materialFormData(metadata, articleFile, imageFile);
  const { data } = await requestWithCsrf({
    method: 'post',
    url: '/api/materiais',
    data: body,
    onUploadProgress: progress,
  });
  return data;
}

export async function updateMaterialMetadata(id, metadata) {
  const { data } = await requestWithCsrf({
    method: 'patch',
    url: `/api/materiais/${id}`,
    data: metadata,
  });
  return data;
}

export async function replaceMaterialFiles(id, articleFile, progressOrLegacyCover, onUploadProgress) {
  const progress = typeof progressOrLegacyCover === 'function' ? progressOrLegacyCover : onUploadProgress;
  const body = new FormData();
  body.append('arquivo', articleFile);
  const { data } = await requestWithCsrf({
    method: 'put',
    url: `/api/materiais/${id}/arquivo`,
    data: body,
    onUploadProgress: progress,
  });
  return data;
}

export async function getMaterialContent(id) {
  const { data } = await api.get(`/api/materiais/${id}/conteudo`, { responseType: 'text' });
  return data;
}

export async function setMaterialActive(id, active) {
  const { data } = await requestWithCsrf({
    method: 'patch',
    url: `/api/materiais/${id}/${active ? 'ativar' : 'inativar'}`,
  });
  return data;
}

export async function deleteMaterial(id) {
  await requestWithCsrf({ method: 'delete', url: `/api/materiais/${id}` });
}

function materialFormData(metadata, articleFile, image) {
  const body = new FormData();
  body.append('dados', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  body.append('arquivo', articleFile);
  if (image) body.append('imagem', image);
  return body;
}
