import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import useAuth from '../auth/useAuth';

vi.mock('../auth/useAuth');
vi.mock('./LoadingWave', () => ({ default: () => <div>Carregando</div> }));

function renderRoute(adminOnly = false) {
  return render(<MemoryRouter initialEntries={['/administrador']}><Routes>
    <Route path="/login" element={<div>Login</div>} />
    <Route path="/perfil" element={<div>Perfil</div>} />
    <Route path="/administrador" element={<ProtectedRoute adminOnly={adminOnly}><div>Admin</div></ProtectedRoute>} />
  </Routes></MemoryRouter>);
}

describe('ProtectedRoute', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redireciona visitante para login', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    renderRoute(true);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('nega dashboard a uma gestante autenticada', () => {
    useAuth.mockReturnValue({ user: { nivelAcesso: 'GESTANTE' }, loading: false });
    renderRoute(true);
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('libera dashboard somente para ADMIN', () => {
    useAuth.mockReturnValue({ user: { nivelAcesso: 'ADMIN' }, loading: false });
    renderRoute(true);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
