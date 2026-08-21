import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Plus, Shield, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPokemon } from '../api/pokeApi';
import PokemonCard from '../components/PokemonCard';
import PageLoader from '../components/PageLoader';
import TypeBadge from '../components/TypeBadge';
import { useTrainer } from '../context/trainerContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function TeamMember({ id, onRemove, query }) {
  if (query.isPending) return <div className="team-member team-member--loading"><PageLoader label="" /></div>;
  if (query.isError) {
    return (
      <div className="team-member-error" role="alert">
        <Shield size={25} aria-hidden="true" />
        <strong>No pudimos cargar este integrante</strong>
        <button type="button" onClick={() => query.refetch()}>Reintentar</button>
        <button type="button" onClick={() => onRemove(id)}>Quitar del equipo</button>
      </div>
    );
  }

  return (
    <div className="team-member">
      <PokemonCard pokemon={{ id: query.data.id, name: query.data.name }} />
      <button className="team-member__remove" type="button" onClick={() => onRemove(id)}>
        <Trash2 size={16} aria-hidden="true" /> Quitar del equipo
      </button>
    </div>
  );
}

export default function TeamPage() {
  useDocumentTitle('Mi equipo');
  const { team, toggleTeamMember, maxTeamSize } = useTrainer();
  const emptySlots = Math.max(maxTeamSize - team.length, 0);
  const memberQueries = useQueries({
    queries: team.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: ({ signal }) => getPokemon(id, { signal }),
    })),
  });
  const loadedMembers = memberQueries.map((query) => query.data).filter(Boolean);

  // El resumen reutiliza los datos de las cards; no realiza pedidos adicionales.
  const teamAnalysis = useMemo(() => {
    const typeCounts = new Map();
    let totalStats = 0;
    loadedMembers.forEach((pokemon) => {
      pokemon.types.forEach((entry) => {
        const type = entry.type.name;
        typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
      });
      totalStats += pokemon.stats.reduce((total, entry) => total + entry.base_stat, 0);
    });

    return {
      types: [...typeCounts.entries()].sort((a, b) => b[1] - a[1]),
      averageStats: loadedMembers.length ? Math.round(totalStats / loadedMembers.length) : 0,
    };
  }, [loadedMembers]);

  return (
    <div className="collection-page page-shell">
      <header className="page-heading page-heading--team">
        <span className="page-heading__icon"><Shield size={25} /></span>
        <p className="eyebrow">Panel de entrenador</p>
        <h1>Tu equipo ideal</h1>
        <p>Elegí hasta seis compañeros. La selección queda guardada solamente en este dispositivo.</p>
        <div className="team-progress" aria-label={`${team.length} de ${maxTeamSize} lugares ocupados`}>
          {Array.from({ length: maxTeamSize }, (_, index) => (
            <span key={index} className={index < team.length ? 'team-progress__filled' : ''} />
          ))}
          <strong>{team.length}/{maxTeamSize}</strong>
        </div>
      </header>

      <div className="team-grid">
        {team.map((id, index) => (
          <TeamMember
            key={id}
            id={id}
            query={memberQueries[index]}
            onRemove={toggleTeamMember}
          />
        ))}
        {Array.from({ length: emptySlots }, (_, index) => (
          <Link className="team-slot" to="/" key={`slot-${index}`}>
            <span><Plus size={24} /></span>
            <strong>Lugar disponible</strong>
            <small>Elegir Pokémon</small>
          </Link>
        ))}
      </div>

      {loadedMembers.length > 0 && (
        <section className="team-analysis" aria-labelledby="team-analysis-title">
          <div className="team-analysis__heading">
            <div>
              <p className="eyebrow">Lectura del equipo</p>
              <h2 id="team-analysis-title">Cobertura elemental</h2>
            </div>
            <div className="team-analysis__metrics">
              <span><strong>{teamAnalysis.types.length}</strong> tipos presentes</span>
              <span><strong>{teamAnalysis.averageStats}</strong> promedio base</span>
            </div>
          </div>
          <div className="team-type-list">
            {teamAnalysis.types.map(([type, count]) => (
              <div key={type}>
                <TypeBadge type={type} />
                <strong>×{count}</strong>
              </div>
            ))}
          </div>
          <p>Este resumen describe la composición; las debilidades también dependen de la combinación de tipos de cada integrante.</p>
        </section>
      )}

      {team.length === 0 && (
        <p className="team-tip">Empezá por tu favorito o buscá una combinación equilibrada de tipos.</p>
      )}
    </div>
  );
}
