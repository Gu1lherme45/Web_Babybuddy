import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Perfil from './Perfil';
import useAuth from '../../auth/useAuth';
import { listPublicMaterials } from '../../services/materialService';

vi.mock('../../auth/useAuth');
vi.mock('../../services/materialService', () => ({ listPublicMaterials: vi.fn() }));

describe('Perfil', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listPublicMaterials.mockResolvedValue([]);
  });

  it('usa o identificador do e-mail quando a sessão não possui nome', async () => {
    useAuth.mockReturnValue({
      user: { id: 7, username: 'maria@example.com', nivelAcesso: 'GESTANTE' },
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      logout: vi.fn(),
    });

    render(<MemoryRouter><Perfil /></MemoryRouter>);

    expect(screen.getByText('maria')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir perfil' })).toHaveTextContent('M');
  });
});
