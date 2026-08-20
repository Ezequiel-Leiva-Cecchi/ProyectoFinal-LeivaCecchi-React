import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPokemon, getPokemonIndex } from './pokeApi';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cliente de PokéAPI', () => {
  it('convierte la lista nacional en registros con ID', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 2,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
        ],
      }),
    });

    await expect(getPokemonIndex()).resolves.toEqual({
      count: 2,
      results: [
        { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        { id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
      ],
    });
  });

  it('explica un registro inexistente con un mensaje legible', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 404 });
    await expect(getPokemon('missingno')).rejects.toThrow('No encontramos ese Pokémon.');
    await getPokemon('missingno').catch((error) => expect(error.status).toBe(404));
  });
});
