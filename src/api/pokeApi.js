import { extractResourceId } from '../utils/pokemon';

export const POKE_API_URL = 'https://pokeapi.co/api/v2';
const SPRITE_REPOSITORY = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

// Todos los pedidos pasan por esta función para compartir manejo de errores y cancelación.
async function fetchJson(pathOrUrl, { signal } = {}) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${POKE_API_URL}${pathOrUrl}`;
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? 'No encontramos ese Pokémon.'
        : 'PokéAPI no respondió correctamente. Intentá nuevamente.',
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// La lista de especies representa la Pokédex Nacional y excluye formas repetidas.
export async function getPokemonIndex({ signal } = {}) {
  const data = await fetchJson('/pokemon-species?limit=2000', { signal });
  return {
    count: data.count,
    results: data.results
      .map((pokemon) => ({ ...pokemon, id: extractResourceId(pokemon.url) }))
      .filter((pokemon) => pokemon.id),
  };
}

export function getPokemon(identifier, options) {
  return fetchJson(`/pokemon/${encodeURIComponent(String(identifier).toLowerCase())}`, options);
}

export function getPokemonSpecies(identifier, options) {
  return fetchJson(`/pokemon-species/${encodeURIComponent(String(identifier).toLowerCase())}`, options);
}

export function getGenerations(options) {
  return fetchJson('/generation?limit=100', options);
}

export function getGeneration(identifier, options) {
  return fetchJson(`/generation/${encodeURIComponent(identifier)}`, options);
}

export function getType(identifier, options) {
  return fetchJson(`/type/${encodeURIComponent(identifier)}`, options);
}

export function getEvolutionChain(url, options) {
  return fetchJson(url, options);
}

// Las URLs predecibles permiten mostrar una portada sin pedir mil detalles al iniciar.
export function getOfficialArtworkUrl(id) {
  return `${SPRITE_REPOSITORY}/other/official-artwork/${id}.png`;
}

export function getPixelSpriteUrl(id) {
  return `${SPRITE_REPOSITORY}/${id}.png`;
}

export function getArtworkFromPokemon(pokemon) {
  return (
    pokemon?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon?.sprites?.other?.home?.front_default ||
    pokemon?.sprites?.front_default ||
    getOfficialArtworkUrl(pokemon?.id)
  );
}
