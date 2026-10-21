import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ConfirmPopup from './ConfirmPopup.jsx';

describe('ConfirmPopup', () => {
  test('muestra el aviso y los botones, y dispara los callbacks', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmPopup
        message="¿ Desea eliminar permanentemente el Juan seleccionado ?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByText('!!! AVISO !!!')).toBeInTheDocument();
    expect(
      screen.getByText('¿ Desea eliminar permanentemente el Juan seleccionado ?'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ACEPTAR' }));
    expect(onConfirm).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'CANCELAR' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
