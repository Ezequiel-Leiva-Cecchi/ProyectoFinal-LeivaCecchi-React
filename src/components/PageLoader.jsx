import PokeballMark from './PokeballMark';

export default function PageLoader({ label = 'Cargando' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <PokeballMark className="page-loader__mark pokeball-mark" />
      <span>{label}</span>
    </div>
  );
}
