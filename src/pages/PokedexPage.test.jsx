import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TrainerProvider } from '../context/TrainerContext';
import PokedexPage from './PokedexPage';

const pokemonDetails = {
  1: { id: 1, name: 'bulbasaur', types: [{ type: { name: 'grass' } }] },
  4: { id: 4, name: 'charmander', types: [{ type: { name: 'fire' } }] },
};

function createFetchResponse(data) {
  return Promise.resolve({ ok: true, json: async () => data });
}

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
}

function renderPokedex() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <TrainerProvider>
        <MemoryRouter>
          <PokedexPage />
          <LocationProbe />
        </MemoryRouter>
      </TrainerProvider>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('pantalla principal de la Pokédex', () => {
  it('muestra resultados y permite buscar sin controles anidados', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((request) => {
      const url = String(request);
      if (url.includes('/pokemon-species?')) {
        return createFetchResponse({
          count: 2,
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
            { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon-species/4/' },
          ],
        });
      }
      if (url.includes('/generation?')) {
        return createFetchResponse({ count: 1, results: [{ name: 'generation-i' }] });
      }
      const id = Number(url.match(/\/pokemon\/(\d+)/)?.[1]);
      return createFetchResponse(pokemonDetails[id]);
    });

    const { container } = renderPokedex();
    expect(await screen.findByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Charmander' })).toBeInTheDocument();
    expect(container.querySelector('button a, a button')).toBeNull();

    const catalogSearch = screen.getAllByRole('searchbox')[1];
    fireEvent.change(catalogSearch, { target: { value: 'char' } });
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Bulbasaur' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: 'Charmander' })).toBeInTheDocument();
    expect(screen.getByTestId('location-search')).toHaveTextContent('?q=char');
  });
});
