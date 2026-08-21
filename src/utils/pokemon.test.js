import { describe, expect, it } from 'vitest';
import {
  extractResourceId,
  filterPokemonIndex,
  formatDexNumber,
  formatEvolutionCondition,
  formatPokemonName,
  getLocalizedFlavorText,
  mapEvolutionChain,
  normalizeSearch,
  sortPokemonIndex,
} from './pokemon';

describe('utilidades de Pokémon', () => {
  it('extrae identificadores de las URLs de PokéAPI', () => {
    expect(extractResourceId('https://pokeapi.co/api/v2/pokemon-species/1025/')).toBe(1025);
    expect(extractResourceId('sin-identificador')).toBeNull();
  });

  it('presenta números con formato uniforme', () => {
    expect(formatDexNumber(25)).toBe('#0025');
    expect(formatDexNumber(1025)).toBe('#1025');
  });

  it('corrige nombres especiales y slugs', () => {
    expect(formatPokemonName('mr-mime')).toBe('Mr. Mime');
    expect(formatPokemonName('nidoran-f')).toBe('Nidoran ♀');
    expect(formatPokemonName('great-tusk')).toBe('Great Tusk');
  });

  it('normaliza acentos y espacios de búsqueda', () => {
    expect(normalizeSearch('  Eléctrico ')).toBe('electrico');
  });

  it('prioriza descripciones en español', () => {
    const entries = [
      { flavor_text: 'English text', language: { name: 'en' } },
      { flavor_text: 'Texto\nen español', language: { name: 'es' } },
    ];
    expect(getLocalizedFlavorText(entries)).toBe('Texto en español');
  });

  it('filtra por nombre, tipo y generación', () => {
    const index = [
      { id: 1, name: 'bulbasaur' },
      { id: 4, name: 'charmander' },
      { id: 906, name: 'sprigatito' },
    ];
    expect(
      filterPokemonIndex(index, {
        search: 'spri',
        typeIds: new Set([1, 906]),
        generationIds: new Set([906]),
      }),
    ).toEqual([{ id: 906, name: 'sprigatito' }]);
  });

  it('busca números de Pokédex con numeral y ceros iniciales', () => {
    const index = [
      { id: 4, name: 'charmander' },
      { id: 25, name: 'pikachu' },
      { id: 125, name: 'electabuzz' },
    ];

    expect(
      filterPokemonIndex(index, {
        search: '#0025',
        typeIds: null,
        generationIds: null,
      }),
    ).toEqual([{ id: 25, name: 'pikachu' }]);
  });

  it('ordena sin modificar la lista original', () => {
    const index = [{ id: 2, name: 'ivysaur' }, { id: 1, name: 'bulbasaur' }];
    expect(sortPokemonIndex(index, 'id-asc').map((entry) => entry.id)).toEqual([1, 2]);
    expect(index[0].id).toBe(2);
  });

  it('traduce condiciones frecuentes de evolución', () => {
    expect(formatEvolutionCondition({ trigger: { name: 'level-up' }, min_level: 16 })).toBe('Nivel 16');
    expect(formatEvolutionCondition({ trigger: { name: 'use-item' }, item: { name: 'fire-stone' } })).toBe('Fire Stone');
    expect(
      formatEvolutionCondition({
        trigger: { name: 'level-up' },
        min_level: 30,
        min_happiness: 220,
        time_of_day: 'night',
        needs_overworld_rain: true,
      }),
    ).toBe('Nivel 30 · Amistad 220+ · De noche · Con lluvia');
  });

  it('mantiene las bifurcaciones de una cadena evolutiva', () => {
    const chain = mapEvolutionChain({
      species: { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon-species/133/' },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: 'vaporeon', url: 'https://pokeapi.co/api/v2/pokemon-species/134/' },
          evolution_details: [{ trigger: { name: 'use-item' }, item: { name: 'water-stone' } }],
          evolves_to: [],
        },
        {
          species: { name: 'jolteon', url: 'https://pokeapi.co/api/v2/pokemon-species/135/' },
          evolution_details: [{ trigger: { name: 'use-item' }, item: { name: 'thunder-stone' } }],
          evolves_to: [],
        },
      ],
    });
    expect(chain.children).toHaveLength(2);
    expect(chain.children.map((entry) => entry.id)).toEqual([134, 135]);
  });
});
