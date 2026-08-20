import { Heart } from 'lucide-react';
import { useTrainer } from '../context/trainerContext';
import { formatPokemonName } from '../utils/pokemon';

export default function FavoriteButton({ id, name, className = '' }) {
  const { isFavorite, toggleFavorite } = useTrainer();
  const active = isFavorite(id);
  const readableName = formatPokemonName(name);

  return (
    <button
      className={`favorite-button${active ? ' favorite-button--active' : ''} ${className}`.trim()}
      type="button"
      aria-pressed={active}
      aria-label={`${active ? 'Quitar' : 'Agregar'} a ${readableName} de favoritos`}
      title={`${active ? 'Quitar de' : 'Agregar a'} favoritos`}
      onClick={() => toggleFavorite(id)}
    >
      <Heart size={19} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );
}
