export default function PokeballMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="27" className="pokeball-mark__base" />
      <path d="M5 31A27 27 0 0 1 59 31H5Z" className="pokeball-mark__top" />
      <path d="M5 32H59" className="pokeball-mark__line" />
      <circle cx="32" cy="32" r="10" className="pokeball-mark__button" />
      <circle cx="32" cy="32" r="4" className="pokeball-mark__core" />
    </svg>
  );
}
