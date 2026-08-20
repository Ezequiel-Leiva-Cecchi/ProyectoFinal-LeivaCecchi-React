// Los 18 tipos oficiales se centralizan para mantener colores y traducciones
// consistentes en filtros, cards y fichas de detalle.
export const POKEMON_TYPES = [
  { key: 'normal', label: 'Normal', color: '#a8a878' },
  { key: 'fire', label: 'Fuego', color: '#ff6b45' },
  { key: 'water', label: 'Agua', color: '#4d9eff' },
  { key: 'electric', label: 'Eléctrico', color: '#f6c945' },
  { key: 'grass', label: 'Planta', color: '#62c778' },
  { key: 'ice', label: 'Hielo', color: '#72d7d7' },
  { key: 'fighting', label: 'Lucha', color: '#d64d5e' },
  { key: 'poison', label: 'Veneno', color: '#b968c7' },
  { key: 'ground', label: 'Tierra', color: '#d9ad62' },
  { key: 'flying', label: 'Volador', color: '#8ea6ea' },
  { key: 'psychic', label: 'Psíquico', color: '#fb6f92' },
  { key: 'bug', label: 'Bicho', color: '#9fbd46' },
  { key: 'rock', label: 'Roca', color: '#c4a75b' },
  { key: 'ghost', label: 'Fantasma', color: '#7669a8' },
  { key: 'dragon', label: 'Dragón', color: '#7866ed' },
  { key: 'dark', label: 'Siniestro', color: '#75645d' },
  { key: 'steel', label: 'Acero', color: '#9ca9bb' },
  { key: 'fairy', label: 'Hada', color: '#e78fbe' },
];

export const TYPE_BY_KEY = Object.fromEntries(
  POKEMON_TYPES.map((type) => [type.key, type]),
);

// Las etiquetas se muestran en español sin alterar los nombres que entrega la API.
export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. especial',
  'special-defense': 'Def. especial',
  speed: 'Velocidad',
};

export const PAGE_SIZE = 24;
export const MAX_TEAM_SIZE = 6;
