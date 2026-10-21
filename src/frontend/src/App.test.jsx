import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AppRoutes } from './App.jsx';

beforeEach(() => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: [] }),
  });
});

describe('rutas', () => {
  test('/login muestra la página de inicio de sesión', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Iniciar Sesion' })).toBeInTheDocument();
  });

  test('/ redirige al login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Iniciar Sesion' })).toBeInTheDocument();
  });

  test('/home muestra la pantalla home', async () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('button', { name: 'CLIENTES' })).toBeInTheDocument();
  });

  test('/clientes muestra la página de Clientes', async () => {
    render(
      <MemoryRouter initialEntries={['/clientes']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('Buscar clientes')).toBeInTheDocument();
  });

  test('/clientes/nuevo muestra la página Nuevo Cliente', async () => {
    render(
      <MemoryRouter initialEntries={['/clientes/nuevo']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Nuevo Cliente')).toBeInTheDocument();
  });

  test('/clientes/:id/info muestra la página de información del cliente', async () => {
    render(
      <MemoryRouter initialEntries={['/clientes/1/info']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText('LavAutos oPreto')).toBeInTheDocument();
  });

  test('/clientes/:id/editar muestra la página Editar Cliente', async () => {
    render(
      <MemoryRouter initialEntries={['/clientes/1/editar']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Editar Cliente')).toBeInTheDocument();
  });
});
