import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPokemonIndex } from '../api/pokeApi';
import PokemonGrid from '../components/PokemonGrid';
import { useTrainer } from '../context/trainerContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function FavoritesPage() {
  useDocumentTitle('Favoritos');
  const { favorites } = useTrainer();
  const indexQuery = useQuery({
    queryKey: ['pokedex-index'],
    queryFn: ({ signal }) => getPokemonIndex({ signal }),
  });
  const entries = useMemo(
    () => (indexQuery.data?.results ?? []).filter((pokemon) => favorites.includes(pokemon.id)),
    [favorites, indexQuery.data],
  );

  return (
    <div className="collection-page page-shell">
      <header className="page-heading">
        <span className="page-heading__icon"><Heart size={24} fill="currentColor" /></span>
        <p className="eyebrow">Colección personal</p>
        <h1>Tus favoritos</h1>
        <p>Guardá los Pokémon que más te gustan y volvé a encontrarlos sin repetir búsquedas.</p>
      </header>

      {!indexQuery.isPending && favorites.length === 0 ? (
        <section className="collection-empty">
          <Heart size={34} aria-hidden="true" />
          <h2>Tu colección todavía está vacía</h2>
          <p>Marcá el corazón de cualquier card o ficha para guardarla acá.</p>
          <Link className="button" to="/">
            <Search size={18} /> Explorar la Pokédex
          </Link>
        </section>
      ) : (
        <PokemonGrid
          pokemon={entries}
          isLoading={indexQuery.isPending}
          error={indexQuery.error}
          onRetry={indexQuery.refetch}
        />
      )}
    </div>
  );
}
