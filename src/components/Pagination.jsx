import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goToPage = (nextPage) => {
    onPageChange(nextPage);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('catalog-results')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <nav className="pagination" aria-label="Paginación de la Pokédex">
      <button
        className="pagination__button"
        type="button"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
      >
        <ChevronLeft size={18} aria-hidden="true" /> Anterior
      </button>
      <p aria-live="polite">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </p>
      <button
        className="pagination__button"
        type="button"
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
      >
        Siguiente <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
