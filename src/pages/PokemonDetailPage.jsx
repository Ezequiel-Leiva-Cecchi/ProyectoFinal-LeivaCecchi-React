import { useEffect, useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  getAbility,
  getArtworkFromPokemon,
  getEvolutionChain,
  getPixelSpriteUrl,
  getPokemon,
  getPokemonIndex,
  getPokemonSpecies,
  getMove,
} from '../api/pokeApi';
import { TYPE_BY_KEY } from '../config/pokemon';
import EvolutionTree from '../components/EvolutionTree';
import FavoriteButton from '../components/FavoriteButton';
import PageLoader from '../components/PageLoader';
import StatePanel from '../components/StatePanel';
import StatBars from '../components/StatBars';
import TypeBadge from '../components/TypeBadge';
import { useTrainer } from '../context/trainerContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  extractResourceId,
  formatDexNumber,
  formatGenerationName,
  formatHeight,
  formatPokemonName,
  formatWeight,
  getLocalizedFlavorText,
  getLocalizedGenus,
  getLocalizedName,
  mapEvolutionChain,
} from '../utils/pokemon';

export default function PokemonDetailPage() {
  const { identifier } = useParams();
  const pokemonKey = /^\d+$/.test(identifier ?? '') ? Number(identifier) : identifier?.toLowerCase();
  const location = useLocation();
  const returnTo = location.state?.from ?? '/';
  const navigationState = { from: returnTo };
  const [teamMessage, setTeamMessage] = useState('');
  const { isInTeam, recordViewed, toggleTeamMember } = useTrainer();

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', pokemonKey],
    queryFn: ({ signal }) => getPokemon(identifier, { signal }),
  });
  const speciesId = extractResourceId(pokemonQuery.data?.species?.url);
  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', speciesId],
    queryFn: ({ signal }) => getPokemonSpecies(speciesId, { signal }),
    enabled: Boolean(speciesId),
  });
  const evolutionUrl = speciesQuery.data?.evolution_chain?.url;
  const evolutionQuery = useQuery({
    queryKey: ['evolution-chain', evolutionUrl],
    queryFn: ({ signal }) => getEvolutionChain(evolutionUrl, { signal }),
    enabled: Boolean(evolutionUrl),
  });
  const indexQuery = useQuery({
    queryKey: ['pokedex-index'],
    queryFn: ({ signal }) => getPokemonIndex({ signal }),
  });

  const pokemon = pokemonQuery.data;
  const species = speciesQuery.data;
  const displayName = pokemon
    ? pokemon.is_default
      ? getLocalizedName(species?.names, pokemon.name)
      : formatPokemonName(pokemon.name)
    : 'Ficha Pokémon';
  useDocumentTitle(displayName);

  const featuredMoves = useMemo(() => [...new Map(
    (pokemon?.moves ?? [])
      .flatMap((entry) => entry.version_group_details
        .filter((detail) => detail.move_learn_method.name === 'level-up')
        .map((detail) => ({ name: entry.move.name, level: detail.level_learned_at })))
      .sort((a, b) => b.level - a.level)
      .map((move) => [move.name, move]),
  ).values()].slice(0, 12), [pokemon?.moves]);
  const abilityQueries = useQueries({
    queries: (pokemon?.abilities ?? []).map((entry) => ({
      queryKey: ['ability', entry.ability.name],
      queryFn: ({ signal }) => getAbility(entry.ability.name, { signal }),
    })),
  });
  const moveQueries = useQueries({
    queries: featuredMoves.map((move) => ({
      queryKey: ['move', move.name],
      queryFn: ({ signal }) => getMove(move.name, { signal }),
    })),
  });

  useEffect(() => {
    if (pokemon?.id) recordViewed(pokemon.id);
  }, [pokemon?.id, recordViewed]);

  const evolutionChain = useMemo(
    () => mapEvolutionChain(evolutionQuery.data?.chain),
    [evolutionQuery.data],
  );

  if (pokemonQuery.isPending || (pokemon && speciesQuery.isPending)) {
    return <PageLoader label="Analizando registro Pokémon" />;
  }

  if (pokemonQuery.isError || speciesQuery.isError) {
    const error = pokemonQuery.error || speciesQuery.error;
    return (
      <div className="page-shell page-state-wrap">
        <StatePanel
          variant="error"
          title="Registro no disponible"
          message={error?.message || 'No pudimos cargar esta ficha.'}
          actionLabel="Intentar nuevamente"
          onAction={() => {
            pokemonQuery.refetch();
            if (speciesId) speciesQuery.refetch();
          }}
        />
        <Link className="text-link" to={returnTo}>
          <ArrowLeft size={17} /> Volver a la Pokédex
        </Link>
      </div>
    );
  }

  const types = pokemon.types.map((entry) => entry.type.name);
  const accent = TYPE_BY_KEY[types[0]]?.color ?? '#4ed8d0';
  const description = getLocalizedFlavorText(species.flavor_text_entries);
  const genus = getLocalizedGenus(species.genera);
  const artwork = getArtworkFromPokemon(pokemon);
  const inTeam = isInTeam(pokemon.id);
  const index = indexQuery.data?.results ?? [];
  const nationalId = pokemon.id <= (indexQuery.data?.count ?? 0) ? pokemon.id : speciesId;
  const previous = nationalId > 1 ? index[nationalId - 2] : null;
  const next = nationalId < index.length ? index[nationalId] : null;
  const varieties = species.varieties?.filter((entry) => entry.pokemon.name !== pokemon.name) ?? [];
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTeam = () => {
    const result = toggleTeamMember(pokemon.id);
    if (result === 'limit') {
      setTeamMessage('Tu equipo ya tiene seis integrantes. Quitá uno antes de sumar otro.');
    } else if (result === 'removed') {
      setTeamMessage(`${displayName} salió de tu equipo.`);
    } else {
      setTeamMessage(`${displayName} se sumó a tu equipo.`);
    }
  };

  const useFallbackSprite = (event) => {
    const fallback = getPixelSpriteUrl(pokemon.id);
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
  };

  return (
    <article className="detail-page" style={{ '--detail-accent': accent }}>
      <section className="detail-hero">
        <div className="detail-hero__grid page-shell">
          <div className="detail-copy">
            <nav className="breadcrumb" aria-label="Migas de pan">
              <Link to={returnTo}>Pokédex</Link>
              <ChevronRight size={15} aria-hidden="true" />
              <span>{displayName}</span>
            </nav>
            <p className="detail-number">{formatDexNumber(pokemon.id)}</p>
            <p className="eyebrow">{genus}</p>
            <h1>{displayName}</h1>
            <div className="type-list detail-types">
              {types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
            <p className="detail-description">{description}</p>

            <div className="detail-actions">
              <button
                className={`button${inTeam ? ' button--team-active' : ''}`}
                type="button"
                onClick={handleTeam}
              >
                {inTeam ? <Minus size={18} /> : <Plus size={18} />}
                {inTeam ? 'Quitar del equipo' : 'Sumar al equipo'}
              </button>
              <FavoriteButton id={pokemon.id} name={pokemon.name} className="favorite-button--large" />
            </div>
            <p className="team-message" aria-live="polite">
              {teamMessage}
            </p>
          </div>

          <div className="detail-artwork">
            <span className="detail-artwork__number" aria-hidden="true">
              {String(pokemon.id).padStart(3, '0')}
            </span>
            <span className="detail-artwork__ring" aria-hidden="true" />
            <img
              src={artwork}
              alt={`Ilustración oficial de ${displayName}`}
              onError={useFallbackSprite}
            />
            {pokemon.is_default && (
              <span className="detail-artwork__verified">
                <Check size={15} aria-hidden="true" /> Forma principal
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="detail-content page-shell">
        <nav className="detail-anchor-nav" aria-label="Secciones de la ficha">
          <button type="button" onClick={() => scrollToSection('perfil')}>Perfil</button>
          {featuredMoves.length > 0 && <button type="button" onClick={() => scrollToSection('movimientos')}>Movimientos</button>}
          <button type="button" onClick={() => scrollToSection('estadisticas')}>Estadísticas</button>
          <button type="button" onClick={() => scrollToSection('evoluciones')}>Evoluciones</button>
          {varieties.length > 0 && <button type="button" onClick={() => scrollToSection('formas')}>Formas</button>}
        </nav>

        <section id="perfil" className="detail-section detail-profile">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">Datos de campo</p>
              <h2>Perfil biológico</h2>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-metrics">
              <div><span>Altura</span><strong>{formatHeight(pokemon.height)}</strong></div>
              <div><span>Peso</span><strong>{formatWeight(pokemon.weight)}</strong></div>
              <div><span>Experiencia base</span><strong>{pokemon.base_experience ?? '—'}</strong></div>
              <div><span>Generación</span><strong>{formatGenerationName(species.generation?.name)}</strong></div>
              <div><span>Captura</span><strong>{species.capture_rate}/255</strong></div>
              <div><span>Hábitat</span><strong>{formatPokemonName(species.habitat?.name ?? 'desconocido')}</strong></div>
            </div>

            <div className="profile-list-card">
              <h3>Habilidades</h3>
              <ul className="chip-list">
                {pokemon.abilities.map((entry, index) => (
                  <li key={entry.ability.name}>
                    {getLocalizedName(abilityQueries[index]?.data?.names, formatPokemonName(entry.ability.name))}
                    {entry.is_hidden && <small>Oculta</small>}
                  </li>
                ))}
              </ul>
              <h3>Grupos huevo</h3>
              <ul className="chip-list chip-list--muted">
                {species.egg_groups.map((entry) => (
                  <li key={entry.name}>{formatPokemonName(entry.name)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {featuredMoves.length > 0 && (
          <section id="movimientos" className="detail-section">
            <div className="section-heading section-heading--compact">
              <div>
                <p className="eyebrow">Aprendizaje natural</p>
                <h2>Movimientos destacados</h2>
              </div>
              <p>Una selección de los movimientos que aprende al subir de nivel, ordenados desde los más avanzados.</p>
            </div>
            <div className="move-grid">
              {featuredMoves.map((move, index) => (
                <div className="move-card" key={move.name}>
                  <span>{move.level ? `Nivel ${move.level}` : 'Al evolucionar'}</span>
                  <strong>{getLocalizedName(moveQueries[index]?.data?.names, formatPokemonName(move.name))}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="estadisticas" className="detail-section">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">Potencial de combate</p>
              <h2>Estadísticas base</h2>
            </div>
            <p>Los valores muestran el potencial natural de la especie antes del entrenamiento.</p>
          </div>
          <StatBars stats={pokemon.stats} />
        </section>

        <section id="evoluciones" className="detail-section">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="eyebrow">Línea evolutiva</p>
              <h2>Caminos de evolución</h2>
            </div>
            <p>Las condiciones principales se muestran debajo de cada etapa.</p>
          </div>
          {evolutionQuery.isPending ? (
            <PageLoader label="Reconstruyendo cadena evolutiva" />
          ) : evolutionQuery.isError ? (
            <div className="section-note section-note--error" role="alert">
              <p>No pudimos reconstruir la cadena evolutiva.</p>
              <button type="button" onClick={() => evolutionQuery.refetch()}>Reintentar</button>
            </div>
          ) : (
            <div className="evolution-tree">
              <EvolutionTree chain={evolutionChain} navigationState={navigationState} />
            </div>
          )}
        </section>

        {varieties.length > 0 && (
          <section id="formas" className="detail-section">
            <div className="section-heading section-heading--compact">
              <div>
                <p className="eyebrow">Variaciones registradas</p>
                <h2>Otras formas</h2>
              </div>
            </div>
            <div className="variety-grid">
              {varieties.map((entry) => (
                <Link
                  key={entry.pokemon.name}
                  to={`/pokemon/${entry.pokemon.name}`}
                  state={navigationState}
                >
                  <Sparkles size={18} aria-hidden="true" />
                  <span>{formatPokemonName(entry.pokemon.name)}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav className="pokemon-neighbours" aria-label="Pokémon anterior y siguiente">
          {previous ? (
            <Link to={`/pokemon/${previous.id}`} state={navigationState}>
              <ArrowLeft size={18} />
              <span><small>Anterior</small>{formatPokemonName(previous.name)}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/pokemon/${next.id}`} state={navigationState}>
              <span><small>Siguiente</small>{formatPokemonName(next.name)}</span>
              <ArrowRight size={18} />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
