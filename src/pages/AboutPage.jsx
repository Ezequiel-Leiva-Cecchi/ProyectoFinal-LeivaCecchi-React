import { Database, HeartHandshake, Link2, LockKeyhole, Rocket, Scale, Search, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const features = [
  {
    icon: Search,
    title: 'Pokédex completa',
    copy: 'La cantidad no está escrita a mano: se consulta directamente desde la lista nacional de PokéAPI.',
  },
  {
    icon: Rocket,
    title: 'Carga inteligente',
    copy: 'Los resultados se paginan y los detalles se almacenan temporalmente para evitar pedidos repetidos.',
  },
  {
    icon: Scale,
    title: 'Comparador visual',
    copy: 'Dos especies pueden enfrentarse en una lectura clara de tipos, dimensiones y estadísticas base.',
  },
  {
    icon: Link2,
    title: 'Búsquedas compartibles',
    copy: 'Filtros, orden y página viven en la URL para regresar al mismo punto o enviar el resultado.',
  },
  {
    icon: Shield,
    title: 'Equipo de seis',
    copy: 'Podés diseñar tu equipo ideal sin iniciar sesión ni enviar información a un servidor.',
  },
  {
    icon: LockKeyhole,
    title: 'Privacidad primero',
    copy: 'Favoritos y equipo viven en localStorage. No hay checkout, tarjetas, Firebase ni formularios sensibles.',
  },
];

export default function AboutPage() {
  useDocumentTitle('Acerca del proyecto');

  return (
    <div className="about-page page-shell">
      <header className="page-heading page-heading--about">
        <span className="page-heading__icon"><HeartHandshake size={25} /></span>
        <p className="eyebrow">Proyecto reconstruido</p>
        <h1>De entrega de curso a experiencia real</h1>
        <p>
          NovaDex nació al transformar una antigua tienda demostrativa de React en una herramienta
          dedicada a explorar el universo Pokémon con mejor arquitectura, accesibilidad y seguridad.
        </p>
      </header>

      <section className="about-feature-grid" aria-label="Características técnicas">
        {features.map(({ icon: Icon, title, copy }) => (
          <article key={title}>
            <span><Icon size={23} /></span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="data-source-card">
        <div>
          <span className="data-source-card__icon"><Database size={26} /></span>
          <p className="eyebrow">Fuente de datos</p>
          <h2>PokéAPI + repositorio oficial de sprites</h2>
          <p>
            Los nombres, estadísticas, especies, evoluciones y artes se consultan cuando hacen falta.
            NovaDex no vende productos ni representa una enciclopedia oficial de The Pokémon Company.
          </p>
        </div>
        <a className="button button--secondary" href="https://pokeapi.co/" target="_blank" rel="noreferrer">
          Conocer PokéAPI
        </a>
      </section>

      <div className="about-cta">
        <p>El laboratorio está listo. Solo falta elegir por dónde empezar.</p>
        <Link className="button" to="/">Abrir la Pokédex</Link>
      </div>
    </div>
  );
}
