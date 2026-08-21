const SPECIAL_NAMES = {
  'farfetchd': "Farfetch'd",
  'sirfetchd': "Sirfetch'd",
  'mr-mime': 'Mr. Mime',
  'mime-jr': 'Mime Jr.',
  'mr-rime': 'Mr. Rime',
  'nidoran-f': 'Nidoran ♀',
  'nidoran-m': 'Nidoran ♂',
  'type-null': 'Código Cero',
  'flabebe': 'Flabébé',
  'wo-chien': 'Wo-Chien',
  'chien-pao': 'Chien-Pao',
  'ting-lu': 'Ting-Lu',
  'chi-yu': 'Chi-Yu',
};

// Extrae el identificador numérico de cualquier URL de recurso de PokéAPI.
export function extractResourceId(url = '') {
  const match = String(url).match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

// Convierte los slugs de la API en nombres legibles para la interfaz.
export function formatPokemonName(name = '') {
  const normalized = String(name).toLowerCase();
  if (SPECIAL_NAMES[normalized]) return SPECIAL_NAMES[normalized];

  return normalized
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatDexNumber(id) {
  return `#${String(id).padStart(4, '0')}`;
}

// Quita acentos para que búsquedas como "electrico" encuentren "Eléctrico".
export function normalizeSearch(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function formatFlavorText(text = '') {
  return String(text).replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// PokéAPI contiene textos en varios idiomas. Se prioriza español y se usa
// inglés únicamente como respaldo cuando una especie no tiene traducción.
export function getLocalizedFlavorText(entries = []) {
  const spanish = entries.filter((entry) => entry.language?.name === 'es');
  const english = entries.filter((entry) => entry.language?.name === 'en');
  const selected = spanish.at(-1) ?? english.at(-1);
  return formatFlavorText(selected?.flavor_text) || 'Todavía no hay una descripción disponible.';
}

export function getLocalizedName(entries = [], fallback = '') {
  return (
    entries.find((entry) => entry.language?.name === 'es')?.name ||
    entries.find((entry) => entry.language?.name === 'en')?.name ||
    formatPokemonName(fallback)
  );
}

export function getLocalizedGenus(entries = []) {
  return (
    entries.find((entry) => entry.language?.name === 'es')?.genus ||
    entries.find((entry) => entry.language?.name === 'en')?.genus ||
    'Pokémon desconocido'
  );
}

export function formatHeight(decimetres = 0) {
  return `${(decimetres / 10).toLocaleString('es-AR', { maximumFractionDigits: 1 })} m`;
}

export function formatWeight(hectograms = 0) {
  return `${(hectograms / 10).toLocaleString('es-AR', { maximumFractionDigits: 1 })} kg`;
}

export function formatGenerationName(name = '') {
  const roman = name.replace('generation-', '').toUpperCase();
  return roman ? `Generación ${roman}` : 'Generación';
}

// Conserva las bifurcaciones de cadenas como Eevee en lugar de convertirlas
// en una lista plana que perdería la relación entre cada evolución.
export function mapEvolutionChain(link) {
  if (!link?.species) return null;

  const conditions = [...new Set(
    (link.evolution_details ?? []).map(formatEvolutionCondition).filter(Boolean),
  )];
  return {
    id: extractResourceId(link.species.url),
    name: link.species.name,
    condition: conditions.length ? conditions.join(' o ') : 'Pokémon inicial',
    children: (link.evolves_to ?? []).map(mapEvolutionChain).filter(Boolean),
  };
}

export function formatEvolutionCondition(detail = {}) {
  if (!detail.trigger) return 'Pokémon inicial';
  const conditions = [];

  // Una evolución puede combinar varias reglas; se conservan todas en vez de
  // detenerse al encontrar la primera (por ejemplo, nivel + amistad + noche).
  if (detail.trigger.name === 'trade') conditions.push('Intercambio');
  if (detail.min_level) conditions.push(`Nivel ${detail.min_level}`);
  if (detail.item?.name) conditions.push(formatPokemonName(detail.item.name));
  if (detail.held_item?.name) conditions.push(`Con ${formatPokemonName(detail.held_item.name)}`);
  if (detail.known_move?.name) conditions.push(`Movimiento ${formatPokemonName(detail.known_move.name)}`);
  if (detail.known_move_type?.name) conditions.push(`Movimiento tipo ${formatPokemonName(detail.known_move_type.name)}`);
  if (detail.min_happiness) conditions.push(`Amistad ${detail.min_happiness}+`);
  if (detail.min_affection) conditions.push(`Afecto ${detail.min_affection}+`);
  if (detail.min_beauty) conditions.push(`Belleza ${detail.min_beauty}+`);
  if (detail.time_of_day) conditions.push(detail.time_of_day === 'day' ? 'De día' : 'De noche');
  if (detail.location?.name) conditions.push(`En ${formatPokemonName(detail.location.name)}`);
  if (detail.gender === 1) conditions.push('Hembra');
  if (detail.gender === 2) conditions.push('Macho');
  if (detail.party_species?.name) conditions.push(`Con ${formatPokemonName(detail.party_species.name)} en el equipo`);
  if (detail.party_type?.name) conditions.push(`Con tipo ${formatPokemonName(detail.party_type.name)} en el equipo`);
  if (detail.trade_species?.name) conditions.push(`Por ${formatPokemonName(detail.trade_species.name)}`);
  if (detail.relative_physical_stats === 1) conditions.push('Ataque mayor que Defensa');
  if (detail.relative_physical_stats === -1) conditions.push('Ataque menor que Defensa');
  if (detail.relative_physical_stats === 0) conditions.push('Ataque igual a Defensa');
  if (detail.needs_overworld_rain) conditions.push('Con lluvia');
  if (detail.turn_upside_down) conditions.push('Consola invertida');

  return conditions.join(' · ') || formatPokemonName(detail.trigger.name);
}

// La lógica de filtrado se mantiene pura para poder probarla sin renderizar React.
export function filterPokemonIndex(index, { search, typeIds, generationIds }) {
  // También acepta el formato habitual de una Pokédex: #025 o 0025.
  const normalizedSearch = normalizeSearch(search).replace(/^#/, '');
  const isNumericSearch = /^\d+$/.test(normalizedSearch);
  const searchedId = isNumericSearch ? Number(normalizedSearch) : null;

  return index.filter((pokemon) => {
    const matchesSearch =
      !normalizedSearch ||
      (isNumericSearch
        ? pokemon.id === searchedId
        : normalizeSearch(pokemon.name).includes(normalizedSearch));
    const matchesType = !typeIds || typeIds.has(pokemon.id);
    const matchesGeneration = !generationIds || generationIds.has(pokemon.id);
    return matchesSearch && matchesType && matchesGeneration;
  });
}

export function sortPokemonIndex(index, sortBy) {
  const copy = [...index];
  if (sortBy === 'name-asc') return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'name-desc') return copy.sort((a, b) => b.name.localeCompare(a.name));
  if (sortBy === 'id-desc') return copy.sort((a, b) => b.id - a.id);
  return copy.sort((a, b) => a.id - b.id);
}
