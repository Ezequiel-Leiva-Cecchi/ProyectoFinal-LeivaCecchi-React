import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TrainerProvider } from '../context/TrainerContext';
import PokemonDetailPage from './PokemonDetailPage';

function response(data) {
  return Promise.resolve({ ok: true, json: async () => data });
}

function renderDetail() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <TrainerProvider>
        <MemoryRouter initialEntries={['/pokemon/25']}>
          <Routes>
            <Route path="/pokemon/:identifier" element={<PokemonDetailPage />} />
          </Routes>
        </MemoryRouter>
      </TrainerProvider>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ficha de un Pokémon', () => {
  it('muestra datos localizados, evolución y permite sumarlo al equipo', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((request) => {
      const url = String(request);

      if (url.endsWith('/pokemon/25')) {
        return response({
          id: 25,
          name: 'pikachu',
          is_default: true,
          species: { url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
          types: [{ type: { name: 'electric' } }],
          abilities: [{ ability: { name: 'static' }, is_hidden: false }],
          stats: [{ base_stat: 90, stat: { name: 'speed' } }],
          height: 4,
          weight: 60,
          base_experience: 112,
          sprites: {
            other: { 'official-artwork': { front_default: 'https://example.test/pikachu.png' } },
          },
        });
      }

      if (url.endsWith('/pokemon-species/25')) {
        return response({
          names: [{ language: { name: 'es' }, name: 'Pikachu' }],
          genera: [{ language: { name: 'es' }, genus: 'Pokémon Ratón' }],
          flavor_text_entries: [
            { language: { name: 'es' }, flavor_text: 'Almacena electricidad en sus mejillas.' },
          ],
          evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
          generation: { name: 'generation-i' },
          capture_rate: 190,
          habitat: { name: 'forest' },
          egg_groups: [{ name: 'field' }],
          varieties: [{ pokemon: { name: 'pikachu' }, is_default: true }],
        });
      }

      if (url.endsWith('/evolution-chain/10/')) {
        return response({
          chain: {
            species: { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon-species/172/' },
            evolution_details: [],
            evolves_to: [],
          },
        });
      }

      if (url.endsWith('/ability/static')) {
        return response({
          names: [{ language: { name: 'es' }, name: 'Electricidad Estática' }],
        });
      }

      if (url.includes('/pokemon-species?')) {
        return response({ count: 1025, results: [] });
      }

      throw new Error(`Pedido inesperado: ${url}`);
    });

    renderDetail();

    expect(await screen.findByRole('heading', { level: 1, name: 'Pikachu' })).toBeInTheDocument();
    expect(screen.getByText('Almacena electricidad en sus mejillas.')).toBeInTheDocument();
    expect(await screen.findByText('Electricidad Estática')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Pichu/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Sumar al equipo/i }));
    expect(screen.getByText('Pikachu se sumó a tu equipo.')).toBeInTheDocument();
    expect(localStorage.getItem('novadex:team')).toBe('[25]');
  });
});
