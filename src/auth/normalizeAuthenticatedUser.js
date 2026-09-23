export function normalizeAuthenticatedUser(data) {
  if (!data || typeof data !== 'object') return null;

  const username = typeof data.username === 'string' ? data.username.trim() : '';
  const informedName = typeof data.nome === 'string' ? data.nome.trim() : '';
  const fallbackName = username.includes('@') ? username.split('@')[0] : username;

  return {
    ...data,
    nome: informedName || fallbackName || 'Usuária',
    username,
  };
}
