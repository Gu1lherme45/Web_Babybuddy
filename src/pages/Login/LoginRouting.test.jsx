import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import Navbar from '../../components/layout/Navbar';

const auth = vi.hoisted(() => ({
  user: { username: 'administrador@babybuddy.com.br', nivelAcesso: 'ADMIN' },
  login: vi.fn(),
}));
vi.mock('../../auth/useAuth', () => ({ default: () => auth }));

describe('Entrada administrativa', () => {
  it.each(['/perfil', '/questionario', '/administrador/materiais/novo'])(
    'abre o dashboard com menu mesmo com retorno para %s', async (pathname) => {
      auth.login.mockResolvedValue(auth.user);
      render(<MemoryRouter initialEntries={[{ pathname: '/login', state: { from: { pathname } } }]}>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/administrador" element={<h1>Dashboard Administrativo</h1>} />
        </Routes>
      </MemoryRouter>);
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('E-mail'), auth.user.username);
      await user.type(screen.getByLabelText('Senha'), 'test-password');
      await user.click(screen.getByRole('button', { name: 'Login' }));
      expect(await screen.findByRole('heading', { name: 'Dashboard Administrativo' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Dashboard Administrativo' })).toHaveAttribute('href', '/administrador');
      expect(screen.getByRole('link', { name: 'BabyBuddy' })).toHaveAttribute('href', '/administrador');
    },
  );
});
