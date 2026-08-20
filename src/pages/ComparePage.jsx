import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftRight, ArrowUpRight, Scale, Search, Swords } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  getArtworkFromPokemon,
  getPixelSpriteUrl,
  getPokemon,
  getPokemonIndex,
} from '../api/pokeApi';
import { STAT_LABELS, TYPE_BY_KEY } from '../config/pokemon';
import PageLoader from '../components/PageLoader';
import StatePanel from '../components/StatePanel';
import TypeBadge from '../components/TypeBadge';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  formatDexNumber,
  formatHeight,
  formatPokemonName,
  formatWeight,
  normalizeSearch,
} from '../utils/pokemon';

const DEFAULT_FIRST_ID = 25;
const DEFAULT_SECOND_ID = 448;

function readId(value, fallback) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : fallback;
}

// Acepta tanto el nombre de la API como un número escrito con # y ceros.
function resolvePokemonInput(value, index) {
  const normalized = normalizeSearch(value).replace(/^#/, '');
  if (/^\d+$/.test(normalized)) {
    const id = Number(normalized);
    return index.some((entry) => entry.id === id) ? id : null;
  }

  const match = index.find((entry) => {
    const apiName = normalizeSearch(entry.name);
    const readableName = normalizeSearch(formatPokemonName(entry.name));
    return normalized === apiName || normalized === readableName;
  });
  return match?.id ?? null;
}

function ComparisonCard({ pokemon, side }) {
  const location = useLocation();
  const types = pokemon.types.map((entry) => entry.type.name);
  const accent = TYPE_BY_KEY[types[0]]?.color ?? '#4ed8d0';
  const name = formatPokemonName(pokemon.name);

  const useFallbackSprite = (event) => {
    const fallback = getPixelSpriteUrl(pokemon.id);
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
  };

  return (
    <article className="compare-card" style={{ '--compare-accent': accent }}>
      <div className="compare-card__topline">
        <span>Pokémon {side}</span>
        <strong>{formatDexNumber(pokemon.id)}</strong>
      </div>
      <div className="compare-card__artwork">
        <span aria-hidden="true" />
        <img
          src={getArtworkFromPokemon(pokemon)}
          alt={`Ilustración oficial de ${name}`}
          onError={useFallbackSprite}
        />
      </div>
      <div className="compare-card__body">
        <h2>{name}</h2>
        <div className="type-list" aria-label={`Tipos de ${name}`}>
          {types.map((type) => <TypeBadge key={type} type={type} />)}
        </div>
        <dl className="compare-card__metrics">
          <div><dt>Altura</dt><dd>{formatHeight(pokemon.height)}</dd></div>
          <div><dt>Peso</dt><dd>{formatWeight(pokemon.weight)}</dd></div>
        </dl>
        <Link
          to={`/pokemon/${pokemon.id}`}
          state={{ from: `${location.pathname}${location.search}` }}
        >
          Abrir ficha <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function getStats(pokemon) {
  return Object.fromEntries(
    pokemon.stats.map((entry) => [entry.stat.name, entry.base_stat]),
  );
}

function ComparisonTable({ first, second }) {
  const firstStats = getStats(first);
  const secondStats = getStats(second);
  const statKeys = Object.keys(STAT_LABELS);
  const firstTotal = statKeys.reduce((total, key) => total + (firstStats[key] ?? 0), 0);
  const secondTotal = statKeys.reduce((total, key) => total + (secondStats[key] ?? 0), 0);

  return (
    <section className="comparison-stats" aria-labelledby="comparison-stats-title">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Lectura comparativa</p>
          <h2 id="comparison-stats-title">Estadísticas base</h2>
        </div>
        <p>Un valor mayor no define por sí solo cuál funcionará mejor en combate.</p>
      </div>

      <div className="comparison-table" role="table" aria-label="Comparación de estadísticas base">
        <div className="comparison-table__header" role="row">
          <strong role="columnheader">{formatPokemonName(first.name)}</strong>
          <span role="columnheader">Atributo</span>
          <strong role="columnheader">{formatPokemonName(second.name)}</strong>
        </div>
        {statKeys.map((key) => {
          const firstValue = firstStats[key] ?? 0;
          const secondValue = secondStats[key] ?? 0;
          return (
            <div className="comparison-row" role="row" key={key}>
              <div
                className={firstValue > secondValue ? 'comparison-value comparison-value--winner' : 'comparison-value'}
                role="cell"
              >
                <strong>{firstValue}</strong>
                <span aria-hidden="true"><i style={{ width: `${(firstValue / 255) * 100}%` }} /></span>
              </div>
              <span className="comparison-row__label" role="rowheader">{STAT_LABELS[key]}</span>
              <div
                className={secondValue > firstValue ? 'comparison-value comparison-value--winner' : 'comparison-value'}
                role="cell"
              >
                <strong>{secondValue}</strong>
                <span aria-hidden="true"><i style={{ width: `${(secondValue / 255) * 100}%` }} /></span>
              </div>
            </div>
          );
        })}
        <div className="comparison-total" role="row">
          <strong role="cell" className={firstTotal > secondTotal ? 'is-winner' : ''}>{firstTotal}</strong>
          <span role="rowheader">Total base</span>
          <strong role="cell" className={secondTotal > firstTotal ? 'is-winner' : ''}>{secondTotal}</strong>
        </div>
      </div>
    </section>
  );
}

export default function ComparePage() {
  useDocumentTitle('Comparador Pokémon');
  const [searchParams, setSearchParams] = useSearchParams();
  const firstId = readId(searchParams.get('a'), DEFAULT_FIRST_ID);
  const secondId = readId(searchParams.get('b'), DEFAULT_SECOND_ID);
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);
  const [formMessage, setFormMessage] = useState('');

  const indexQuery = useQuery({
    queryKey: ['pokedex-index'],
    queryFn: ({ signal }) => getPokemonIndex({ signal }),
  });
  const firstQuery = useQuery({
    queryKey: ['pokemon', firstId],
    queryFn: ({ signal }) => getPokemon(firstId, { signal }),
  });
  const secondQuery = useQuery({
    queryKey: ['pokemon', secondId],
    queryFn: ({ signal }) => getPokemon(secondId, { signal }),
  });
  const index = useMemo(() => indexQuery.data?.results ?? [], [indexQuery.data]);
  const firstName = index.find((entry) => entry.id === firstId)?.name ?? String(firstId);
  const secondName = index.find((entry) => entry.id === secondId)?.name ?? String(secondId);

  const updateComparison = (event) => {
    event.preventDefault();
    const nextFirstId = resolvePokemonInput(firstInputRef.current?.value, index);
    const nextSecondId = resolvePokemonInput(secondInputRef.current?.value, index);

    if (!nextFirstId || !nextSecondId) {
      setFormMessage('Elegí dos Pokémon válidos de las sugerencias.');
      return;
    }
    if (nextFirstId === nextSecondId) {
      setFormMessage('Elegí dos Pokémon diferentes para compararlos.');
      return;
    }

    setFormMessage('');
    setSearchParams({ a: String(nextFirstId), b: String(nextSecondId) });
  };

  const swapPokemon = () => {
    setFormMessage('');
    setSearchParams({ a: String(secondId), b: String(firstId) });
  };

  const error = indexQuery.error || firstQuery.error || secondQuery.error;
  const isLoading = indexQuery.isPending || firstQuery.isPending || secondQuery.isPending;

  return (
    <div className="compare-page page-shell">
      <header className="page-heading page-heading--compare">
        <span className="page-heading__icon"><Scale size={25} /></span>
        <p className="eyebrow">Laboratorio de combate</p>
        <h1>Compará cada detalle</h1>
        <p>
          Poné dos especies frente a frente y descubrí cómo cambian sus estadísticas,
          tipos y dimensiones.
        </p>
      </header>

      <form className="compare-controls" onSubmit={updateComparison}>
        <label>
          <span>Primer Pokémon</span>
          <div><Search size={18} aria-hidden="true" /><input key={`${firstId}-${index.length}`} ref={firstInputRef} list="pokemon-options" defaultValue={firstName} placeholder="Pikachu o #0025" /></div>
        </label>
        <button className="compare-swap" type="button" onClick={swapPokemon} aria-label="Intercambiar Pokémon">
          <ArrowLeftRight size={20} aria-hidden="true" />
        </button>
        <label>
          <span>Segundo Pokémon</span>
          <div><Search size={18} aria-hidden="true" /><input key={`${secondId}-${index.length}`} ref={secondInputRef} list="pokemon-options" defaultValue={secondName} placeholder="Lucario o #0448" /></div>
        </label>
        <button className="button" type="submit" disabled={indexQuery.isPending}>
          <Swords size={18} aria-hidden="true" /> Comparar
        </button>
        <datalist id="pokemon-options">
          {index.map((pokemon) => (
            <option key={pokemon.id} value={pokemon.name}>
              {formatDexNumber(pokemon.id)} · {formatPokemonName(pokemon.name)}
            </option>
          ))}
        </datalist>
        <p className="compare-controls__message" aria-live="polite">{formMessage}</p>
      </form>

      {isLoading ? (
        <PageLoader label="Calibrando el comparador" />
      ) : error ? (
        <StatePanel
          variant="error"
          title="No pudimos completar la comparación"
          message={error.message}
          actionLabel="Intentar nuevamente"
          onAction={() => {
            indexQuery.refetch();
            firstQuery.refetch();
            secondQuery.refetch();
          }}
        />
      ) : (
        <>
          <section className="comparison-arena" aria-label="Pokémon seleccionados">
            <ComparisonCard pokemon={firstQuery.data} side="A" />
            <span className="comparison-versus" aria-hidden="true">VS</span>
            <ComparisonCard pokemon={secondQuery.data} side="B" />
          </section>
          <ComparisonTable first={firstQuery.data} second={secondQuery.data} />
        </>
      )}
    </div>
  );
}
