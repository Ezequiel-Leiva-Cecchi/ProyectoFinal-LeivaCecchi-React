import { useEffect, useState } from 'react';
import { BrainCircuit, Heart, Info, Menu, Scale, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useTrainer } from '../../context/trainerContext';
import PokeballMark from '../PokeballMark';

const navigation = [
  { to: '/', label: 'Pokédex', end: true },
  { to: '/favoritos', label: 'Favoritos', icon: Heart, counter: 'favorites' },
  { to: '/equipo', label: 'Team Lab', icon: BrainCircuit, counter: 'team' },
  { to: '/comparar', label: 'Comparar', icon: Scale },
  { to: '/proyecto', label: 'Proyecto', icon: Info },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites, team } = useTrainer();
  const counters = { favorites: favorites.length, team: team.length };

  // Escape cierra el menú móvil sin obligar a recorrer todos sus enlaces.
  useEffect(() => {
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Link className="brand" to="/" onClick={() => setIsOpen(false)}>
          <PokeballMark className="brand__mark pokeball-mark" />
          <span className="brand__copy">
            <strong>NovaDex</strong>
            <small>Archivo nacional</small>
          </span>
        </Link>

        <button
          className="nav-toggle icon-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <nav
          id="primary-navigation"
          className={`primary-nav${isOpen ? ' primary-nav--open' : ''}`}
          aria-label="Navegación principal"
        >
          {navigation.map(({ to, label, icon: Icon, counter, end }) => (
            <NavLink
              key={to}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
            >
              {Icon && <Icon size={17} aria-hidden="true" />}
              <span>{label}</span>
              {counter && counters[counter] > 0 && (
                <span className="nav-link__count" aria-label={`${counters[counter]} guardados`}>
                  {counters[counter]}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
