import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ComparePage from './ComparePage';

const pokemon = {
  25: {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    types: [{ type: { name: 'electric' } }],
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
      { base_stat: 40, stat: { name: 'defense' } },
      { base_stat: 50, stat: { name: 'special-attack' } },
      { base_stat: 50, stat: { name: 'special-defense' } },
      { base_stat: 90, stat: { name: 'speed' } },
    ],
    sprites: { front_default: 'https://example.test/pikachu.png' },
  },
  448: {
    id: 448,
    name: 'lucario',
    height: 12,
    weight: 540,
    types: [{ type: { name: 'fighting' } }, { type: { name: 'steel' } }],
    stats: [
      { base_stat: 70, stat: { name: 'hp' } },
      { base_stat: 110, stat: { name: 'attack' } },
      { base_stat: 70, stat: { name: 'defense' } },
      { base_stat: 115, stat: { name: 'special-attack' } },
      { base_stat: 70, stat: { name: 'special-defense' } },
      { base_stat: 90, stat: { name: 'speed' } },
    ],
    sprites: { front_default: 'https://example.test/lucario.png' },
  },
};

function apiResponse(data) {
  return Promise.resolve({ ok: true, json: async () => data });
}

function renderCompare() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ComparePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('comparador Pokémon', () => {
  it('enfrenta dos especies y evita compararlas consigo mismas', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((request) => {
      const url = String(request);
      if (url.includes('/pokemon-species?')) {
        return apiResponse({
          count: 2,
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
            { name: 'lucario', url: 'https://pokeapi.co/api/v2/pokemon-species/448/' },
          ],
        });
      }
      const id = Number(url.match(/\/pokemon\/(\d+)/)?.[1]);
      return apiResponse(pokemon[id]);
    });

    const { container } = renderCompare();
    expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lucario' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Comparación de estadísticas base' })).toBeInTheDocument();
    expect(container.querySelector('button a, a button')).toBeNull();

    fireEvent.change(screen.getByLabelText('Segundo Pokémon'), { target: { value: 'pikachu' } });
    fireEvent.click(screen.getByRole('button', { name: /^Comparar$/i }));
    expect(screen.getByText('Elegí dos Pokémon diferentes para compararlos.')).toBeInTheDocument();
  });
});
