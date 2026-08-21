import PokemonCard from './PokemonCard';
import StatePanel from './StatePanel';

function CardSkeleton() {
  return (
    <div className="pokemon-card pokemon-card--skeleton" aria-hidden="true">
      <span className="skeleton skeleton--number" />
      <span className="skeleton skeleton--artwork" />
      <span className="skeleton skeleton--name" />
      <span className="skeleton skeleton--type" />
    </div>
  );
}

export default function PokemonGrid({ pokemon, isLoading, error, onRetry }) {
  if (isLoading) {
    return (
      <div className="pokemon-grid" aria-label="Cargando Pokémon">
        {Array.from({ length: 12 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <StatePanel
        variant="error"
        title="La conexión con el laboratorio falló"
        message={error.message || 'No pudimos consultar la Pokédex en este momento.'}
        actionLabel="Intentar nuevamente"
        onAction={onRetry}
      />
    );
  }

  if (!pokemon.length) {
    return (
      <StatePanel
        title="No encontramos coincidencias"
        message="Probá con otro nombre, número, tipo o generación."
      />
    );
  }

  return (
    <div className="pokemon-grid">
      {pokemon.map((entry) => (
        <PokemonCard key={entry.id} pokemon={entry} />
      ))}
    </div>
  );
}
