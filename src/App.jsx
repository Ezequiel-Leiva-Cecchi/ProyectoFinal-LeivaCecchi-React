import { lazy, Suspense } from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { TrainerProvider } from './context/TrainerContext';
import AppLayout from './components/layout/AppLayout';
import PageLoader from './components/PageLoader';

// Cada pantalla se descarga cuando hace falta para que la portada inicial sea liviana.
const PokedexPage = lazy(() => import('./pages/PokedexPage'));
const PokemonDetailPage = lazy(() => import('./pages/PokemonDetailPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  // GitHub Pages usa hash routing para que las rutas funcionen sin servidor.
  // Vercel mantiene URLs limpias mediante BrowserRouter y su rewrite propio.
  const Router = import.meta.env.VITE_ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter;

  return (
    <TrainerProvider>
      <Router>
        <Suspense fallback={<PageLoader label="Preparando la Pokédex" />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<PokedexPage />} />
              <Route path="pokemon/:identifier" element={<PokemonDetailPage />} />
              <Route path="favoritos" element={<FavoritesPage />} />
              <Route path="equipo" element={<TeamPage />} />
              <Route path="comparar" element={<ComparePage />} />
              <Route path="proyecto" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </TrainerProvider>
  );
}
