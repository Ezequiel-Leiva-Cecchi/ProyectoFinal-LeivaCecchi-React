import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOfficialArtworkUrl, getPixelSpriteUrl } from '../api/pokeApi';
import { formatDexNumber, formatPokemonName } from '../utils/pokemon';

function EvolutionNode({ node, navigationState }) {
  const useFallbackSprite = (event) => {
    const fallback = getPixelSpriteUrl(node.id);
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
  };

  return (
    <div className="evolution-branch">
      <Link className="evolution-node" to={`/pokemon/${node.id}`} state={navigationState}>
        <span className="evolution-node__number">{formatDexNumber(node.id)}</span>
        <img
          src={getOfficialArtworkUrl(node.id)}
          alt={`Ilustración de ${formatPokemonName(node.name)}`}
          loading="lazy"
          onError={useFallbackSprite}
        />
        <strong>{formatPokemonName(node.name)}</strong>
        <small>{node.condition}</small>
      </Link>

      {node.children.length > 0 && (
        <div className="evolution-children">
          {node.children.map((child) => (
            <div className="evolution-child" key={`${child.id}-${child.name}`}>
              <ArrowRight className="evolution-arrow" size={22} aria-hidden="true" />
              <EvolutionNode node={child} navigationState={navigationState} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EvolutionTree({ chain, navigationState }) {
  if (!chain) return <p className="section-note">No hay una cadena evolutiva disponible.</p>;
  return <EvolutionNode node={chain} navigationState={navigationState} />;
}
