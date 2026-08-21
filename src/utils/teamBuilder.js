import { TYPE_BY_KEY } from '../config/pokemon';

// Multiplicadores ofensivos de los 18 tipos. El recomendador usa solamente
// información estable de tipos y estadísticas; no simula un metajuego concreto.
const SUPER_EFFECTIVE = {
  normal: [], fire: ['grass', 'ice', 'bug', 'steel'], water: ['fire', 'ground', 'rock'],
  electric: ['water', 'flying'], grass: ['water', 'ground', 'rock'],
  ice: ['grass', 'ground', 'flying', 'dragon'], fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
  poison: ['grass', 'fairy'], ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
  flying: ['grass', 'fighting', 'bug'], psychic: ['fighting', 'poison'],
  bug: ['grass', 'psychic', 'dark'], rock: ['fire', 'ice', 'flying', 'bug'],
  ghost: ['psychic', 'ghost'], dragon: ['dragon'], dark: ['psychic', 'ghost'],
  steel: ['ice', 'rock', 'fairy'], fairy: ['fighting', 'dragon', 'dark'],
};

const WEAK_TO = Object.fromEntries(Object.keys(TYPE_BY_KEY).map((type) => [type, []]));
Object.entries(SUPER_EFFECTIVE).forEach(([attack, defenders]) => {
  defenders.forEach((defender) => WEAK_TO[defender].push(attack));
});

export const TEAM_LAB_CANDIDATES = [
  3, 6, 9, 18, 26, 34, 38, 59, 65, 68, 94, 112, 121, 130, 131, 134, 135, 143,
  149, 169, 181, 196, 197, 205, 212, 214, 227, 230, 242, 248, 257, 260, 282, 286,
  306, 330, 350, 376, 389, 392, 395, 407, 445, 448, 450, 461, 462, 468, 472, 475,
  479, 485, 534, 545, 553, 555, 567, 571, 576, 579, 591, 609, 612, 625, 635, 637,
  658, 663, 681, 700, 706, 715, 724, 727, 730, 733, 745, 748, 750, 763, 766, 778,
  812, 815, 818, 823, 839, 849, 858, 861, 869, 887, 901, 903, 911, 914, 937, 959, 964,
  968, 977, 983, 998, 1000,
];

export const LEGENDARY_CANDIDATES = [144, 145, 146, 150, 243, 244, 245, 249, 250, 382, 383, 384, 483, 484, 487, 643, 644, 716, 717, 718, 791, 792, 800, 888, 889, 1007, 1008];

const LEGENDARY_IDS = new Set([
  ...LEGENDARY_CANDIDATES, 151, 251, 377, 378, 379, 380, 381, 385, 386, 480, 481, 482,
  488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 645, 646, 647, 648,
  649, 719, 720, 721, 772, 773, 785, 786, 787, 788, 789, 790, 793, 794, 795, 796,
  797, 798, 799, 801, 802, 807, 808, 809, 890, 891, 892, 893, 894, 895, 896, 897,
  898, 905, 1001, 1002, 1003, 1004, 1005, 1006, 1009, 1010, 1020, 1021, 1022,
  1023, 1024, 1025,
]);

const statsOf = (pokemon) => Object.fromEntries(
  pokemon.stats.map((entry) => [entry.stat.name, entry.base_stat]),
);
const typesOf = (pokemon) => pokemon.types.map((entry) => entry.type.name);

export function inferRole(pokemon, format = 'singles') {
  const stats = statsOf(pokemon);
  const physical = (stats.attack ?? 0) + (stats.speed ?? 0) * 0.55;
  const special = (stats['special-attack'] ?? 0) + (stats.speed ?? 0) * 0.55;
  const bulk = (stats.hp ?? 0) + (stats.defense ?? 0) * 0.7 + (stats['special-defense'] ?? 0) * 0.7;
  if (format === 'doubles' && bulk > Math.max(physical, special) * 1.45) return 'Soporte resistente';
  if (bulk > Math.max(physical, special) * 1.75) return 'Muro defensivo';
  if (physical > special * 1.08) return (stats.speed ?? 0) >= 95 ? 'Atacante físico veloz' : 'Atacante físico';
  if (special > physical * 1.08) return (stats.speed ?? 0) >= 95 ? 'Atacante especial veloz' : 'Atacante especial';
  return 'Atacante mixto';
}

export function getTeamWeaknesses(team) {
  const counts = new Map();
  team.forEach((pokemon) => {
    const weaknesses = new Set(typesOf(pokemon).flatMap((type) => WEAK_TO[type] ?? []));
    weaknesses.forEach((type) => counts.set(type, (counts.get(type) ?? 0) + 1));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }));
}

function candidateScore(candidate, selected, options) {
  const stats = statsOf(candidate);
  const types = typesOf(candidate);
  const selectedTypes = new Set(selected.flatMap(typesOf));
  const currentCoverage = new Set(selected.flatMap((pokemon) => typesOf(pokemon).flatMap((type) => SUPER_EFFECTIVE[type])));
  const newCoverage = new Set(types.flatMap((type) => SUPER_EFFECTIVE[type]).filter((type) => !currentCoverage.has(type)));
  const sharedWeaknesses = getTeamWeaknesses([...selected, candidate]).filter((entry) => entry.count >= 3).length;
  const baseTotal = Object.values(stats).reduce((total, value) => total + value, 0);
  const favoriteBonus = options.preferFavorites && options.favoriteIds.includes(candidate.id) ? 170 : 0;
  const novelty = types.filter((type) => !selectedTypes.has(type)).length * 35;
  const formatBonus = options.format === 'doubles'
    ? ((stats.hp ?? 0) + (stats.defense ?? 0) + (stats['special-defense'] ?? 0)) * 0.08
    : (stats.speed ?? 0) * 0.18;
  return baseTotal * 0.12 + newCoverage.size * 24 + novelty + favoriteBonus + formatBonus - sharedWeaknesses * 70;
}

export function buildRecommendedTeam(pokemon, options = {}) {
  const settings = {
    format: 'casual', noLegendaries: true, preferFavorites: true, favoriteIds: [], ...options,
  };
  const valid = pokemon.filter(Boolean).filter((entry) => !settings.noLegendaries || !LEGENDARY_IDS.has(entry.id));
  const unique = [...new Map(valid.map((entry) => [entry.id, entry])).values()];
  const selected = [];

  while (selected.length < 6 && selected.length < unique.length) {
    const remaining = unique.filter((entry) => !selected.some((member) => member.id === entry.id));
    remaining.sort((a, b) => candidateScore(b, selected, settings) - candidateScore(a, selected, settings));
    selected.push(remaining[0]);
  }

  const weaknesses = getTeamWeaknesses(selected);
  const coveredTypes = new Set(selected.flatMap((entry) => typesOf(entry).flatMap((type) => SUPER_EFFECTIVE[type])));
  return {
    members: selected.map((entry) => ({
      pokemon: entry,
      role: inferRole(entry, settings.format),
      reason: settings.favoriteIds.includes(entry.id)
        ? 'Uno de tus favoritos que encaja con el balance del equipo.'
        : `${typesOf(entry).map((type) => TYPE_BY_KEY[type]?.label ?? type).join(' / ')} aporta cobertura y un rol diferente.`,
    })),
    weaknesses,
    coveredTypes: coveredTypes.size,
    score: Math.max(0, Math.min(100, Math.round(62 + coveredTypes.size * 1.5 - weaknesses.filter((entry) => entry.count >= 3).length * 6))),
  };
}
