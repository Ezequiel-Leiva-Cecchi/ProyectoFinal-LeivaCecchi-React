import { Code2, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import PokeballMark from '../PokeballMark';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid page-shell">
        <div className="footer-brand">
          <PokeballMark className="footer-brand__mark pokeball-mark" />
          <div>
            <strong>NovaDex</strong>
            <p>Una Pokédex construida para explorar, comparar y recordar.</p>
          </div>
        </div>

        <div className="footer-links" aria-label="Enlaces del proyecto">
          <Link to="/proyecto">Acerca del proyecto</Link>
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
            <Database size={16} aria-hidden="true" /> Datos de PokéAPI
          </a>
          <a
            href="https://github.com/Ezequiel-Leiva-Cecchi/ProyectoFinal-LeivaCecchi-React"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={16} aria-hidden="true" /> Código en GitHub
          </a>
        </div>
      </div>
      <p className="site-footer__legal page-shell">
        Proyecto educativo no afiliado a Nintendo, Game Freak ni The Pokémon Company.
      </p>
    </footer>
  );
}
