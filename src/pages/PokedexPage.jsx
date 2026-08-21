import { useDeferredValue, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Dices, Search, Shield, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  getGeneration,
  getGenerations,
  getOfficialArtworkUrl,
  getPokemonIndex,
  getType,
} from '../api/pokeApi';
import { PAGE_SIZE, POKEMON_TYPES } from '../config/pokemon';
import { useTrainer } from '../context/trainerContext';
import PokemonGrid from '../components/PokemonGrid';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  extractResourceId,
  filterPokemonIndex,
  formatGenerationName,
  sortPokemonIndex,
} from '../utils/pokemon';

const CURATED_POKEMON = [
  { id: 6, name: 'charizard' },
  { id: 94, name: 'gengar' },
  { id: 448, name: 'lucario' },
  { id: 700, name: 'sylveon' },
  { id: 887, name: 'dragapult' },
  { id: 1000, name: 'gholdengo' },
];

const REGION_SHORTCUTS = [
  ['Kanto', 'generation-i'], ['Johto', 'generation-ii'], ['Hoenn', 'generation-iii'],
  ['Sinnoh', 'generation-iv'], ['Teselia', 'generation-v'], ['Kalos', 'generation-vi'],
  ['Alola', 'generation-vii'], ['Galar', 'generation-viii'], ['Paldea', 'generation-ix'],
];

export default function PokedexPage() {
  useDocumentTitle('Pokédex Nacional');
  const navigate = useNavigate();
  const { recent } = useTrainer();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);
  const search = searchParams.get('q') ?? '';
  const requestedType = searchParams.get('tipo') ?? 'all';
  const type = POKEMON_TYPES.some((entry) => entry.key === requestedType) ? requestedType : 'all';
  const requestedGeneration = searchParams.get('generacion') ?? 'all';
  const generation = requestedGeneration === 'all' || /^generation-[ivxlcdm]+$/.test(requestedGeneration)
    ? requestedGeneration
    : 'all';
  const requestedSort = searchParams.get('orden') ?? 'id-asc';
  const sortBy = ['id-asc', 'id-desc', 'name-asc', 'name-desc'].includes(requestedSort)
    ? requestedSort
    : 'id-asc';
  const requestedPage = Math.max(Number.parseInt(searchParams.get('pagina') ?? '1', 10) || 1, 1);
  const deferredSearch = useDeferredValue(search);

  const indexQuery = useQuery({
    queryKey: ['pokedex-index'],
    queryFn: ({ signal }) => getPokemonIndex({ signal }),
  });
  const generationsQuery = useQuery({
    queryKey: ['generations'],
    queryFn: ({ signal }) => getGenerations({ signal }),
  });
  const typeQuery = useQuery({
    queryKey: ['type', type],
    queryFn: ({ signal }) => getType(type, { signal }),
    enabled: type !== 'all',
  });
  const generationQuery = useQuery({
    queryKey: ['generation', generation],
    queryFn: ({ signal }) => getGeneration(generation, { signal }),
    enabled: generation !== 'all',
  });

  const filteredPokemon = useMemo(() => {
    const typeIds =
      type === 'all' || !typeQuery.data
        ? null
        : new Set(typeQuery.data.pokemon.map((entry) => extractResourceId(entry.pokemon.url)));
    const generationIds =
      generation === 'all' || !generationQuery.data
        ? null
        : new Set(
            generationQuery.data.pokemon_species.map((entry) => extractResourceId(entry.url)),
          );

    const filtered = filterPokemonIndex(indexQuery.data?.results ?? [], {
      search: deferredSearch,
      typeIds,
      generationIds,
    });
    return sortPokemonIndex(filtered, sortBy);
  }, [deferredSearch, generation, generationQuery.data, indexQuery.data, sortBy, type, typeQuery.data]);

  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const visiblePokemon = filteredPokemon.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filterIsLoading =
    indexQuery.isPending ||
    (type !== 'all' && typeQuery.isPending) ||
    (generation !== 'all' && generationQuery.isPending);
  const queryError = indexQuery.error || typeQuery.error || generationQuery.error;
  const hasFilters = search || type !== 'all' || generation !== 'all' || sortBy !== 'id-asc';
  const recentPokemon = recent
    .map((id) => indexQuery.data?.results.find((pokemon) => pokemon.id === id))
    .filter(Boolean);
  const discoveryPokemon = recentPokemon.length ? recentPokemon : CURATED_POKEMON;

  // Los filtros se guardan en la URL: al volver desde una ficha se conserva
  // exactamente la búsqueda, y el enlace también se puede compartir.
  const updateFilter = (key, defaultValue) => (event) => {
    const value = event.target.value;
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (!value || value === defaultValue) next.delete(key);
      else next.set(key, value);
      next.delete('pagina');
      return next;
    }, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    searchInputRef.current?.focus();
  };

  const changePage = (nextPage) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextPage === 1) next.delete('pagina');
      else next.set('pagina', String(nextPage));
      return next;
    });
  };

  const openRandomPokemon = () => {
    const total = indexQuery.data?.count;
    if (!total) return;
    navigate(`/pokemon/${Math.floor(Math.random() * total) + 1}`);
  };

  // La tecla "/" lleva al buscador desde cualquier zona no editable.
  useEffect(() => {
    const focusSearch = (event) => {
      const tag = document.activeElement?.tagName;
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const retryQueries = () => {
    indexQuery.refetch();
    if (type !== 'all') typeQuery.refetch();
    if (generation !== 'all') generationQuery.refetch();
  };

  const scrollToCatalog = () => {
    document.querySelector('#catalog-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="pokedex-hero">
        <div className="pokedex-hero__glow" aria-hidden="true" />
        <div className="pokedex-hero__inner page-shell">
          <div className="pokedex-hero__copy">
            <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> Pokédex Nacional · Archivo 2026</p>
            <h1>
              Encontrá a tu
              <span> próximo compañero.</span>
            </h1>
            <p className="pokedex-hero__intro">
              Más que una lista: datos, evoluciones, comparaciones y un laboratorio que piensa
              equipos alrededor de tus favoritos.
            </p>

            <label className="hero-search">
              <span className="sr-only">Buscar por nombre o número</span>
              <Search size={22} aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                value={search}
                placeholder="Buscá Pikachu, Gengar o #094..."
                onChange={updateFilter('q', '')}
                aria-controls="catalog-results"
                aria-keyshortcuts="/"
              />
              <span className="hero-search__hint">Tecla /</span>
            </label>

            <div className="hero-actions">
              <button className="button" type="button" onClick={scrollToCatalog}>
                Explorar especies <ArrowRight size={18} aria-hidden="true" />
              </button>
              <Link className="button button--secondary" to="/equipo">
                <Shield size={18} aria-hidden="true" /> Abrir Team Lab
              </Link>
              <button
                className="button button--secondary"
                type="button"
                disabled={!indexQuery.data?.count}
                onClick={openRandomPokemon}
              >
                <Dices size={18} aria-hidden="true" /> Sorprendeme
              </button>
            </div>
          </div>

          <div className="pokedex-hero__visual" aria-hidden="true">
            <div className="hero-device">
              <div className="hero-device__top"><span /><span /><span /><strong>ND–025</strong></div>
              <div className="hero-device__screen">
                <span className="hero-number">025</span>
                <img src={getOfficialArtworkUrl(25)} alt="" />
                <div className="hero-scan-card"><Sparkles size={16} /><span>Compañero detectado</span><strong>Pikachu</strong></div>
              </div>
              <div className="hero-device__controls"><span /><span /><span /></div>
            </div>
            <div className="hero-companion hero-companion--one"><img src={getOfficialArtworkUrl(1)} alt="" /><span>#001</span></div>
            <div className="hero-companion hero-companion--two"><img src={getOfficialArtworkUrl(4)} alt="" /><span>#004</span></div>
          </div>
        </div>

        <div className="hero-stats page-shell" aria-label="Resumen de la Pokédex">
          <div>
            <strong>{indexQuery.data?.count?.toLocaleString('es-AR') ?? '—'}</strong>
            <span>Especies nacionales</span>
          </div>
          <div>
            <strong>18</strong>
            <span>Tipos elementales</span>
          </div>
          <div>
            <strong>{generationsQuery.data?.count ?? '—'}</strong>
            <span>Generaciones</span>
          </div>
          <div>
            <strong>6</strong>
            <span>Lugares en tu equipo</span>
          </div>
        </div>
      </section>

      <section className="discovery-section page-shell" aria-labelledby="discovery-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{recentPokemon.length ? 'Tu recorrido' : 'Selección NovaDex'}</p>
            <h2 id="discovery-title">{recentPokemon.length ? 'Vistos recientemente' : 'Seis especies para empezar'}</h2>
          </div>
          <p>{recentPokemon.length ? 'Retomá una ficha sin volver a buscarla.' : 'Una selección de favoritos de distintas generaciones.'}</p>
        </div>
        <div className="discovery-grid">
          {discoveryPokemon.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)}
        </div>
        <div className="region-explorer">
          <div><p className="eyebrow">Viaje por regiones</p><h3>Elegí una generación</h3></div>
          <div className="region-list">{REGION_SHORTCUTS.map(([label, value]) => <Link key={value} to={`/?generacion=${value}#catalog-results`}>{label}</Link>)}</div>
        </div>
      </section>

      <section id="catalog-results" className="catalog-section page-shell" tabIndex="-1">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Archivo nacional</p>
            <h2>Encontrá a tu próximo compañero</h2>
          </div>
          <p>
            {filterIsLoading
              ? 'Consultando registros...'
              : `${filteredPokemon.length.toLocaleString('es-AR')} especies encontradas`}
          </p>
        </div>

        <div className="filter-panel" aria-label="Filtros de la Pokédex">
          <label className="filter-field filter-field--search">
            <span>Buscar</span>
            <div>
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={search}
                placeholder="Nombre o número"
                onChange={updateFilter('q', '')}
              />
            </div>
          </label>

          <label className="filter-field">
            <span>Tipo</span>
            <select value={type} onChange={updateFilter('tipo', 'all')}>
              <option value="all">Todos los tipos</option>
              {POKEMON_TYPES.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Generación</span>
            <select value={generation} onChange={updateFilter('generacion', 'all')}>
              <option value="all">Todas</option>
              {generationsQuery.data?.results.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {formatGenerationName(entry.name)}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Orden</span>
            <select value={sortBy} onChange={updateFilter('orden', 'id-asc')}>
              <option value="id-asc">Nº menor a mayor</option>
              <option value="id-desc">Nº mayor a menor</option>
              <option value="name-asc">Nombre A–Z</option>
              <option value="name-desc">Nombre Z–A</option>
            </select>
          </label>

          <button
            className="filter-reset"
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
          >
            Limpiar filtros
          </button>
        </div>

        <PokemonGrid
          pokemon={visiblePokemon}
          isLoading={filterIsLoading}
          error={queryError}
          onRetry={retryQueries}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
      </section>
    </>
  );
}
