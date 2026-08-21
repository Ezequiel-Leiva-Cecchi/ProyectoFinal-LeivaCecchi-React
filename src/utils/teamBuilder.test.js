import { describe, expect, it } from 'vitest';
import { buildRecommendedTeam, getTeamWeaknesses, inferRole } from './teamBuilder';

const pokemon = (id, type, stats = [80, 100, 80, 70, 80, 100]) => ({
  id,
  name: `pokemon-${id}`,
  types: type.split('/').map((name) => ({ type: { name } })),
  stats: ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
    .map((name, index) => ({ base_stat: stats[index], stat: { name } })),
});

describe('Team Lab', () => {
  it('arma seis integrantes únicos y prioriza favoritos', () => {
    const pool = [pokemon(1, 'grass'), pokemon(2, 'fire'), pokemon(3, 'water'), pokemon(4, 'electric'), pokemon(5, 'steel'), pokemon(6, 'fairy'), pokemon(7, 'dragon')];
    const result = buildRecommendedTeam(pool, { favoriteIds: [7], preferFavorites: true });
    expect(result.members).toHaveLength(6);
    expect(result.members.some((member) => member.pokemon.id === 7)).toBe(true);
    expect(new Set(result.members.map((member) => member.pokemon.id))).toHaveLength(6);
  });

  it('detecta debilidades compartidas e infiere roles', () => {
    const team = [pokemon(1, 'grass'), pokemon(2, 'bug')];
    expect(getTeamWeaknesses(team).find((entry) => entry.type === 'fire')).toEqual({ type: 'fire', count: 2 });
    expect(inferRole(pokemon(3, 'normal', [70, 140, 60, 40, 60, 120]))).toBe('Atacante físico veloz');
  });

  it('evita repetir la formación anterior incluso con la misma selección aleatoria', () => {
    const pool = Array.from({ length: 12 }, (_, index) => pokemon(index + 1, ['grass', 'fire', 'water', 'electric', 'steel', 'fairy'][index % 6]));
    const first = buildRecommendedTeam(pool, { random: () => 0, strategy: 'balanced' });
    const firstIds = first.members.map((member) => member.pokemon.id);
    const second = buildRecommendedTeam(pool, {
      random: () => 0,
      strategy: 'balanced',
      previousTeamIds: firstIds,
    });
    const firstSignature = [...firstIds].sort((a, b) => a - b).join('-');
    const secondSignature = second.members.map((member) => member.pokemon.id).sort((a, b) => a - b).join('-');

    expect(secondSignature).not.toBe(firstSignature);
    expect(second.strategy.label).toBe('Equilibrado');
  });
});
