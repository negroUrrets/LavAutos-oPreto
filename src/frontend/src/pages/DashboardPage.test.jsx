import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import DashboardPage from './DashboardPage.jsx';

const ESTADOS = [{ codigoEstado: 4, descripcionEstado: 'Entregado' }];

let sessionOk = true;
let lavados = [];
let clientes = [];
let lavadoQuery = null;
let clienteQuery = null;

function data(value) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: value }) });
}

function mockFetch(url) {
  if (url === '/api/auth/session') {
    return Promise.resolve({
      ok: sessionOk,
      status: sessionOk ? 200 : 401,
      json: () => Promise.resolve({ data: sessionOk ? { codigoLogin: 1 } : null }),
    });
  }
  if (url === '/api/estados-lavado') {
    return data(ESTADOS);
  }
  if (typeof url === 'string' && url.startsWith('/api/lavados')) {
    lavadoQuery = url;
    return data(lavados);
  }
  if (typeof url === 'string' && url.startsWith('/api/clientes?sinLavadosDesde=')) {
    clienteQuery = url;
    return data(clientes);
  }
  return data([]);
}

function ClienteInfoStub() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <p>CLIENTE INFO STUB</p>
      <p>{location.state?.from ?? 'SIN ORIGEN'}</p>
      <button
        type="button"
        onClick={() => navigate(location.state?.from ?? '/clientes')}
      >
        Volver
      </button>
    </div>
  );
}

function renderPage(initial = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/home" element={<div>HOME PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
        <Route path="/clientes" element={<div>CLIENTES PAGE</div>} />
        <Route path="/clientes/:id/info" element={<ClienteInfoStub />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  lavadoQuery = null;
  clienteQuery = null;
  lavados = [
    {
      codigoLavado: 12,
      categoria: { descripcionLavado: 'Completo' },
      vehiculo: {
        patenteVehi: 'AB-123-CD',
        modelo: { modeloVehi: 'Corsa', marca: { marcaVehi: 'Chevrolet' } },
        datosCliente: {
          persona: {
            dni: 30111222,
            nombre: 'Ana',
            apellido: 'Perez',
            celular: '1155512345',
            email: 'ana@correo.com',
          },
        },
      },
    },
  ];
  clientes = [{ codigoPersona: 5, nombre: 'Ana', apellido: 'Perez', celular: '1155512345' }];
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DashboardPage', () => {
  test('muestra la etiqueta DASHBOARD, los dos registros y el boton Volver', async () => {
    renderPage();

    expect(await screen.findByText('DASHBOARD')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'DASHBOARD' })).not.toBeInTheDocument();
    expect(screen.getByText('Registro de Lavados...')).toBeInTheDocument();
    expect(screen.getByText('Clientes que NO vuelven desde...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument();
  });

  test('sin sesion valida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('el boton Volver navega al home', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: /volver/i }));

    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument();
  });

  test('al entrar los dos registros estan deshabilitados', async () => {
    renderPage();

    expect(await screen.findByLabelText('Desde...')).toBeDisabled();
    expect(screen.getByLabelText('Hasta...')).toBeDisabled();
    expect(screen.getByLabelText('Seleccione...')).toBeDisabled();

    expect(screen.getByRole('button', { name: 'REGISTRO LAVADOS' }).className).toContain(
      'bg-[#eed8d8]',
    );
    expect(screen.getByRole('button', { name: 'REGISTRO CLIENTES' }).className).toContain(
      'bg-[#eed8d8]',
    );
  });

  test('Registro Lavados habilita su registro y deshabilita el otro', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Desde...');

    await user.click(screen.getByRole('button', { name: 'REGISTRO LAVADOS' }));

    expect(screen.getByLabelText('Desde...')).toBeEnabled();
    expect(screen.getByLabelText('Hasta...')).toBeEnabled();
    expect(screen.getByLabelText('Seleccione...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'REGISTRO LAVADOS' }).className).toContain(
      'bg-[#7eb93c]',
    );
    expect(screen.getByRole('button', { name: 'REGISTRO CLIENTES' }).className).toContain(
      'bg-[#eed8d8]',
    );
  });

  test('Registro Clientes habilita su registro y deshabilita el de lavados', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Desde...');

    await user.click(screen.getByRole('button', { name: 'REGISTRO LAVADOS' }));
    await user.click(screen.getByRole('button', { name: 'REGISTRO CLIENTES' }));

    expect(screen.getByLabelText('Seleccione...')).toBeEnabled();
    expect(screen.getByLabelText('Desde...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'REGISTRO CLIENTES' }).className).toContain(
      'bg-[#7eb93c]',
    );
  });

  test('elegir Desde y Hasta consulta los lavados entregados del rango', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Desde...');

    await user.click(screen.getByRole('button', { name: 'REGISTRO LAVADOS' }));

    const desde = screen.getByLabelText('Desde...');
    const hasta = screen.getByLabelText('Hasta...');
    expect(desde).toHaveAttribute('max');
    expect(hasta).toHaveAttribute('max');

    fireEvent.change(desde, { target: { value: '2026-01-01' } });
    expect(hasta).toHaveAttribute('min', '2026-01-01');

    fireEvent.change(hasta, { target: { value: '2026-01-31' } });

    expect(await screen.findByDisplayValue('12')).toBeInTheDocument();
    expect(lavadoQuery).toBe('/api/lavados?estado=4&desde=2026-01-01&hasta=2026-01-31');
    expect(screen.getByDisplayValue('Completo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('AB-123-CD')).toBeInTheDocument();
  });

  test('+info del lavado abre la ventana y Aceptar la cierra conservando resultados', async () => {
    const user = userEvent.setup();
    renderPage('/dashboard?modo=lavados&desde=2026-01-01&hasta=2026-01-31');
    await screen.findByDisplayValue('12');

    await user.click(screen.getByRole('button', { name: '+ info' }));

    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).getByText('Chevrolet')).toBeInTheDocument();
    expect(within(dialogo).getByText('ana@correo.com')).toBeInTheDocument();

    await user.click(within(dialogo).getByRole('button', { name: 'Aceptar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('12')).toBeInTheDocument();
  });

  test('elegir la fecha de clientes consulta los que no vuelven', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Seleccione...');

    await user.click(screen.getByRole('button', { name: 'REGISTRO CLIENTES' }));

    const fecha = screen.getByLabelText('Seleccione...');
    expect(fecha).toHaveAttribute('max');

    fireEvent.change(fecha, { target: { value: '2026-05-01' } });

    expect(await screen.findByDisplayValue('Ana')).toBeInTheDocument();
    expect(clienteQuery).toBe('/api/clientes?sinLavadosDesde=2026-05-01');
    expect(screen.getByDisplayValue('Perez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1155512345')).toBeInTheDocument();
  });

  test('+info del cliente abre su informacion y Volver restaura la busqueda', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Seleccione...');

    await user.click(screen.getByRole('button', { name: 'REGISTRO CLIENTES' }));
    fireEvent.change(screen.getByLabelText('Seleccione...'), {
      target: { value: '2026-05-01' },
    });
    await screen.findByDisplayValue('Ana');

    await user.click(screen.getByRole('button', { name: '+ info' }));

    expect(await screen.findByText('CLIENTE INFO STUB')).toBeInTheDocument();
    expect(screen.getByText('/dashboard?modo=clientes&fecha=2026-05-01')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Volver' }));

    expect(await screen.findByDisplayValue('Ana')).toBeInTheDocument();
    expect(clienteQuery).toBe('/api/clientes?sinLavadosDesde=2026-05-01');
  });
});
