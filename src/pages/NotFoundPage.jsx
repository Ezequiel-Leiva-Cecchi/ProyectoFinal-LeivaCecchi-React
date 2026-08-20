import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Página no encontrada');

  return (
    <div className="not-found page-shell">
      <span className="not-found__number">404</span>
      <Compass size={40} aria-hidden="true" />
      <p className="eyebrow">Ruta desconocida</p>
      <h1>Este lugar todavía no figura en el mapa</h1>
      <p>La dirección puede haber cambiado o quizás ese registro nunca existió.</p>
      <Link className="button" to="/">
        <ArrowLeft size={18} /> Volver a la Pokédex
      </Link>
    </div>
  );
}
