import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import HomePage from './HomePage.jsx';

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
        <Route path="/clientes" element={<div>CLIENTES PAGE</div>} />
        <Route path="/vehiculos" element={<div>VEHICULOS PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('HomePage', () => {
  test('muestra los 4 botones de acceso y la etiqueta ADMIN', async () => {
    renderHome();

    expect(await screen.findByRole('button', { name: 'CLIENTES' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LAVADOS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VEHICULOS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DASHBOARD' })).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  test('los botones de acceso tienen el hover verde #5ea014', async () => {
    renderHome();

    const boton = await screen.findByRole('button', { name: 'CLIENTES' });
    expect(boton.className).toContain('hover:bg-[#5ea014]');
  });

  test('el ícono de usuario abre el popup de cierre de sesión', async () => {
    const user = userEvent.setup();
    renderHome();
    await screen.findByRole('button', { name: 'CLIENTES' });

    await user.click(screen.getByRole('button', { name: /usuario/i }));

    expect(screen.getByRole('button', { name: 'CERRAR SESION' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  test('CERRAR SESION cierra la sesión y navega al login', async () => {
    const user = userEvent.setup();
    renderHome();
    await screen.findByRole('button', { name: 'CLIENTES' });

    await user.click(screen.getByRole('button', { name: /usuario/i }));
    await user.click(screen.getByRole('button', { name: 'CERRAR SESION' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/auth/logout',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('la X cierra el popup sin cerrar sesión', async () => {
    const user = userEvent.setup();
    renderHome();
    await screen.findByRole('button', { name: 'CLIENTES' });

    await user.click(screen.getByRole('button', { name: /usuario/i }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('button', { name: 'CERRAR SESION' })).not.toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith('/api/auth/logout', expect.anything());
  });

  test('sin sesión válida redirige al login', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 401 });
    renderHome();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('el botón CLIENTES navega a la página de Clientes', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'CLIENTES' }));

    expect(await screen.findByText('CLIENTES PAGE')).toBeInTheDocument();
  });

  test('el botón VEHICULOS navega a la página de Vehiculos', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'VEHICULOS' }));

    expect(await screen.findByText('VEHICULOS PAGE')).toBeInTheDocument();
  });
});
