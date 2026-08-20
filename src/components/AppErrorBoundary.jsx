import { Component } from 'react';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import PokeballMark from './PokeballMark';

// Los límites de error todavía se implementan como clases en React. Esta capa
// evita que un fallo inesperado deje al usuario frente a una pantalla vacía.
export default class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // El error queda visible sólo en la consola local; no se envían datos.
    console.error('NovaDex encontró un error inesperado:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="fatal-error">
        <PokeballMark className="fatal-error__mark pokeball-mark" />
        <span className="fatal-error__icon"><TriangleAlert size={24} aria-hidden="true" /></span>
        <p className="eyebrow">Sistema interrumpido</p>
        <h1>La Pokédex necesita reiniciarse</h1>
        <p>Algo inesperado detuvo esta pantalla. Tus favoritos y tu equipo siguen guardados.</p>
        <button className="button" type="button" onClick={() => window.location.reload()}>
          <RotateCcw size={18} aria-hidden="true" /> Reiniciar NovaDex
        </button>
      </main>
    );
  }
}
