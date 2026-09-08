import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from './Navbar';

const auth = vi.hoisted(() => ({ usuario: null, sair: vi.fn() }));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => auth,
}));

describe('Navbar autenticada', () => {
  beforeEach(() => {
    auth.usuario = null;
    auth.sair.mockReset();
  });

  it('mostra login e cadastro para visitante', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cadastre-se' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'href',
      '/#inicio'
    );
    expect(screen.getByRole('link', { name: 'Artigos' })).toHaveAttribute(
      'href',
      '/#artigoshome'
    );
  });

  it('oculta o menu na tela de login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('mostra perfil e sair inclusive na rota protegida', () => {
    auth.usuario = {
      id: 7,
      nome: 'Lorena',
      username: 'lorena@gmail.com',
      nivelAcesso: 'Gestante',
    };

    render(
      <MemoryRouter initialEntries={['/perfil']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Meu perfil' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'href',
      '/perfil'
    );
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute(
      'href',
      '/sobre'
    );
    expect(screen.getByRole('link', { name: 'Artigos' })).toHaveAttribute(
      'href',
      '/perfil#artigos'
    );
  });

  it('direciona o administrador ao painel e ao gerenciamento de artigos', () => {
    auth.usuario = {
      id: 1,
      nome: 'Administrador',
      username: 'admin@babybuddy.com.br',
      nivelAcesso: 'ADMIN',
    };

    render(
      <MemoryRouter initialEntries={['/administrador']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'href',
      '/administrador'
    );
    expect(screen.getByRole('link', { name: 'Artigos' })).toHaveAttribute(
      'href',
      '/administrador#artigos'
    );
  });

  it('encerra a sessão pelo menu', async () => {
    auth.usuario = {
      id: 1,
      nome: 'Administrador',
      username: 'admin@babybuddy.com.br',
      nivelAcesso: 'ADMIN',
    };
    auth.sair.mockResolvedValue();

    render(
      <MemoryRouter initialEntries={['/administrador']}>
        <Navbar />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Sair' }));
    expect(auth.sair).toHaveBeenCalledOnce();
  });
});
