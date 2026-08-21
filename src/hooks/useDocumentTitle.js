import { useEffect } from 'react';

// Restaura un título coherente al desmontar cada pantalla.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · NovaDex` : 'NovaDex · Pokédex Nacional';
    return () => {
      document.title = 'NovaDex · Pokédex Nacional';
    };
  }, [title]);
}
