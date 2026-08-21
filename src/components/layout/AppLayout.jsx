import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function AppLayout() {
  const skipToContent = () => {
    const content = document.querySelector('#main-content');
    content?.scrollIntoView({ block: 'start' });
    content?.focus({ preventScroll: true });
  };

  return (
    <div className="app-shell">
      <button className="skip-link" type="button" onClick={skipToContent}>
        Saltar al contenido principal
      </button>
      <ScrollToTop />
      <Header />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
