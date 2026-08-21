import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppErrorBoundary from './AppErrorBoundary';

function BrokenComponent() {
  throw new Error('Fallo de prueba');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('límite global de errores', () => {
  it('reemplaza una pantalla rota por una recuperación legible', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <AppErrorBoundary>
        <BrokenComponent />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: 'La Pokédex necesita reiniciarse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reiniciar NovaDex/i })).toBeInTheDocument();
  });
});
