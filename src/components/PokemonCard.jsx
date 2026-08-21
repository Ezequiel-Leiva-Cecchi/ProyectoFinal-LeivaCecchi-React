import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  getOfficialArtworkUrl,
  getPixelSpriteUrl,
  getPokemon,
  getPokemonSpecies,
} from '../api/pokeApi';
import { TYPE_BY_KEY } from '../config/pokemon';
import { formatDexNumber, formatPokemonName } from '../utils/pokemon';
import FavoriteButton from './FavoriteButton';
import TypeBadge from './TypeBadge';

export default function PokemonCard({ pokemon }) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const detailQuery = useQuery({
    queryKey: ['pokemon', pokemon.id],
    queryFn: ({ signal }) => getPokemon(pokemon.id, { signal }),
  });

  const types = detailQuery.data?.types?.map((entry) => entry.type.name) ?? [];
  const accent = TYPE_BY_KEY[types[0]]?.color ?? '#4ed8d0';
  const name = formatPokemonName(pokemon.name);

  const prefetchDetails = () => {
    queryClient.prefetchQuery({
      queryKey: ['pokemon', pokemon.id],
      queryFn: ({ signal }) => getPokemon(pokemon.id, { signal }),
    });
    queryClient.prefetchQuery({
      queryKey: ['pokemon-species', pokemon.id],
      queryFn: ({ signal }) => getPokemonSpecies(pokemon.id, { signal }),
    });
  };

  const useFallbackSprite = (event) => {
    const fallback = getPixelSpriteUrl(pokemon.id);
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
  };

  return (
    <article className="pokemon-card" style={{ '--card-accent': accent }}>
      <FavoriteButton id={pokemon.id} name={pokemon.name} className="pokemon-card__favorite" />
      <Link
        className="pokemon-card__link"
        to={`/pokemon/${pokemon.id}`}
        state={{ from: `${location.pathname}${location.search}` }}
        onMouseEnter={prefetchDetails}
        onFocus={prefetchDetails}
        aria-label={`Ver ficha de ${name}`}
      >
        <div className="pokemon-card__topline">
          <span>{formatDexNumber(pokemon.id)}</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>

        <div className="pokemon-card__artwork">
          <span className="pokemon-card__halo" aria-hidden="true" />
          <img
            src={getOfficialArtworkUrl(pokemon.id)}
            alt={`Ilustración oficial de ${name}`}
            loading="lazy"
            decoding="async"
            onError={useFallbackSprite}
          />
        </div>

        <div className="pokemon-card__body">
          <h2>{name}</h2>
          <div className="type-list" aria-label={`Tipos de ${name}`}>
            {detailQuery.isPending && (
              <span className="type-badge type-badge--loading">Analizando...</span>
            )}
            {types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
            {detailQuery.isError && <span className="card-data-note">Datos no disponibles</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
