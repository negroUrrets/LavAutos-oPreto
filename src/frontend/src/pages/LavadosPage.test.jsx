import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import LavadosPage from './LavadosPage.jsx';

const ESTADOS = [
  { codigoEstado: 1, descripcionEstado: 'En Espera' },
  { codigoEstado: 2, descripcionEstado: 'Lavando' },
  { codigoEstado: 3, descripcionEstado: 'Terminado' },
  { codigoEstado: 4, descripcionEstado: 'Entregado' },
];

let sessionOk = true;
let lavados = [];

function data(value) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: value }) });
}

function crearLavado(codigoLavado, codigoEstado) {
  return {
    codigoLavado,
    fechaHoraLavado: '2026-09-07T13:05:00Z',
    estado: codigoEstado,
    datosEstado: ESTADOS.find((estado) => estado.codigoEstado === codigoEstado),
    categoria: { descripcionLavado: 'Completo' },
    vehiculo: {
      patenteVehi: `AB-12${codigoLavado}-CD`,
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
  };
}

function mockFetch(url, options = {}) {
  if (url === '/api/auth/session') {
    return Promise.resolve({
      ok: sessionOk,
      status: sessionOk ? 200 : 401,
      json: () => Promise.resolve({ data: sessionOk ? { codigoLogin: 1 } : null }),
    });
  }
  if (url === '/api/lavados') {
    return data(lavados);
  }
  if (url === '/api/estados-lavado') {
    return data(ESTADOS);
  }
  if (typeof url === 'string' && url.startsWith('/api/lavados/') && options.method === 'PUT') {
    const id = Number(url.split('/').pop());
    const body = JSON.parse(options.body);
    lavados = lavados.map((lavado) =>
      lavado.codigoLavado === id
        ? {
            ...lavado,
            estado: body.estado,
            datosEstado: ESTADOS.find(
              (estado) => String(estado.codigoEstado) === String(body.estado),
            ),
          }
        : lavado,
    );
    return data({ codigoLavado: id, estado: body.estado });
  }
  return data([]);
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/lavados']}>
      <Routes>
        <Route path="/lavados" element={<LavadosPage />} />
        <Route path="/lavados/:lavadoId/editar" element={<div>EDITAR LAVADO PAGE</div>} />
        <Route path="/home" element={<div>HOME PAGE</div>} />
        <Route path="/clientes" element={<div>CLIENTES PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  lavados = [];
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LavadosPage', () => {
  test('muestra las tres secciones, Nuevo Lavado y el boton de volver', async () => {
    renderPage();

    expect(await screen.findByRole('button', { name: /nuevo lavado/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'En Espera...' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Lavando...' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Terminado...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
  });

  test('sin sesion valida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('Nuevo Lavado navega a la pagina de Clientes', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: /nuevo lavado/i }));

    expect(await screen.findByText('CLIENTES PAGE')).toBeInTheDocument();
  });

  test('el boton de volver navega al home', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: '←' }));

    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument();
  });

  test('agrupa los lavados por estado', async () => {
    lavados = [crearLavado(1, 1), crearLavado(2, 2), crearLavado(3, 3), crearLavado(4, 4)];
    renderPage();

    const enEspera = await screen.findByRole('region', { name: 'En Espera...' });
    const lavando = screen.getByRole('region', { name: 'Lavando...' });
    const terminado = screen.getByRole('region', { name: 'Terminado...' });

    expect(within(enEspera).getByDisplayValue('1')).toBeInTheDocument();
    expect(within(lavando).getByDisplayValue('2')).toBeInTheDocument();
    expect(within(terminado).getByDisplayValue('3')).toBeInTheDocument();
    expect(within(terminado).queryByDisplayValue('4')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('4')).not.toBeInTheDocument();
  });

  test('muestra numero, hora y patente en solo lectura', async () => {
    lavados = [crearLavado(1, 1)];
    renderPage();

    expect(await screen.findByDisplayValue('1')).toHaveAttribute('readonly');
    expect(screen.getByDisplayValue('10:05 am')).toHaveAttribute('readonly');
    expect(screen.getByDisplayValue('AB-121-CD')).toHaveAttribute('readonly');
  });

  test('Editar navega a la pagina de edicion del lavado', async () => {
    const user = userEvent.setup();
    lavados = [crearLavado(1, 1)];
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Editar' }));

    expect(await screen.findByText('EDITAR LAVADO PAGE')).toBeInTheDocument();
  });

  test('contrae y expande una seccion', async () => {
    const user = userEvent.setup();
    lavados = [crearLavado(1, 1)];
    renderPage();

    await screen.findByDisplayValue('1');

    await user.click(screen.getByRole('button', { name: 'Contraer En Espera...' }));
    expect(screen.queryByDisplayValue('1')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expandir En Espera...' }));
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('+info abre la ventana con los datos y Aceptar la cierra', async () => {
    const user = userEvent.setup();
    lavados = [crearLavado(1, 1)];
    renderPage();

    await screen.findByDisplayValue('1');
    await user.click(screen.getByRole('button', { name: '+ info' }));

    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).getByText('Chevrolet')).toBeInTheDocument();
    expect(within(dialogo).getByText('Corsa')).toBeInTheDocument();
    expect(within(dialogo).getByText('30111222')).toBeInTheDocument();
    expect(within(dialogo).getByText('ana@correo.com')).toBeInTheDocument();

    await user.click(within(dialogo).getByRole('button', { name: 'Aceptar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('Lavar mueve el lavado a la seccion Lavando', async () => {
    const user = userEvent.setup();
    lavados = [crearLavado(1, 1)];
    renderPage();

    await screen.findByDisplayValue('1');
    await user.click(screen.getByRole('button', { name: 'Lavar' }));

    expect(screen.getByText('Lavando Vehiculo')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    const lavando = await screen.findByRole('region', { name: 'Lavando...' });
    expect(await within(lavando).findByDisplayValue('1')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/lavados/1',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('Completado mueve el lavado a la seccion Terminado', async () => {
    const user = userEvent.setup();
    lavados = [crearLavado(2, 2)];
    renderPage();

    await screen.findByDisplayValue('2');
    await user.click(screen.getByRole('button', { name: 'Completado' }));

    expect(screen.getByText('Lavado Terminado')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    const terminado = await screen.findByRole('region', { name: 'Terminado...' });
    expect(await within(terminado).findByDisplayValue('2')).toBeInTheDocument();
  });

  test('Entregar marca el lavado como Entregado y deja de mostrarlo', async () => {
    const user = userEvent.setup();
    lavados = [crearLavado(3, 3)];
    renderPage();

    await screen.findByDisplayValue('3');
    await user.click(screen.getByRole('button', { name: 'Entregar' }));

    expect(screen.getByText('Vehiculo Entregado')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(await screen.findByRole('region', { name: 'En Espera...' })).toBeInTheDocument();
    expect(screen.queryByDisplayValue('3')).not.toBeInTheDocument();
  });
});
