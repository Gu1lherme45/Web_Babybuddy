import { describe, expect, it } from 'vitest';
import { normalizeAuthenticatedUser } from './normalizeAuthenticatedUser';

describe('normalizeAuthenticatedUser', () => {
  it('preserva um nome informado', () => {
    expect(normalizeAuthenticatedUser({ username: 'ana@example.com', nome: ' Ana ' }).nome)
      .toBe('Ana');
  });

  it('deriva um nome seguro do username quando nome está ausente', () => {
    expect(normalizeAuthenticatedUser({ username: 'maria@example.com' }).nome)
      .toBe('maria');
  });

  it('usa um rótulo seguro para uma resposta parcial', () => {
    expect(normalizeAuthenticatedUser({}).nome).toBe('Usuária');
  });
});
