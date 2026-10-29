import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import LoginPage from './LoginPage.jsx';

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<div>HOME PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LoginPage', () => {
  test('muestra el título, los campos y el botón', () => {
    renderLogin();

    expect(screen.getByText('LavAutos oPreto')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesion' })).toBeInTheDocument();
  });

  test('no llama al backend y avisa si hay campos vacíos', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Iniciar Sesion' }));

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('envía las credenciales al backend con credentials include', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200 });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Contraseña'), '123456');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesion' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    );
  });

  test('muestra el popup de éxito con !Bienvenid@!', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200 });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Contraseña'), '123456');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesion' }));

    expect(await screen.findByText('!Bienvenid@!')).toBeInTheDocument();
  });

  test('al cerrar el popup de éxito navega al home', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, status: 200 });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Contraseña'), '123456');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesion' }));
    await screen.findByText('!Bienvenid@!');

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument();
  });

  test('muestra el popup de error cuando el login falla', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 401 });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Contraseña'), 'mal');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesion' }));

    expect(await screen.findByText('Usuario / Contraseña incorrecta')).toBeInTheDocument();
  });
});
