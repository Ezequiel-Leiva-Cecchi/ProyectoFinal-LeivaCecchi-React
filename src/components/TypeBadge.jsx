import { TYPE_BY_KEY } from '../config/pokemon';
import { formatPokemonName } from '../utils/pokemon';

export default function TypeBadge({ type }) {
  const metadata = TYPE_BY_KEY[type];
  const label = metadata?.label ?? formatPokemonName(type);

  return (
    <span
      className="type-badge"
      style={{ '--type-color': metadata?.color ?? '#8fa0b5' }}
    >
      <span className="type-badge__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
