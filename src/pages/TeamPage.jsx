import { useMemo, useState } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { Activity, BrainCircuit, Check, ChevronRight, Dices, Heart, Plus, RefreshCw, Shield, Sparkles, Swords, Trash2, Trophy, WandSparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getArtworkFromPokemon, getPokemon } from '../api/pokeApi';
import PokemonCard from '../components/PokemonCard';
import PageLoader from '../components/PageLoader';
import TypeBadge from '../components/TypeBadge';
import { TYPE_BY_KEY } from '../config/pokemon';
import { useTrainer } from '../context/trainerContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { buildRecommendedTeam, getTeamWeaknesses, inferRole, LEGENDARY_CANDIDATES, TEAM_LAB_CANDIDATES } from '../utils/teamBuilder';
import { formatPokemonName } from '../utils/pokemon';

const FORMATS = [
  { id: 'casual', label: 'Aventura', icon: Dices, description: 'Balance general para jugar con tus favoritos.' },
  { id: 'singles', label: 'Individual', icon: Swords, description: 'Presión ofensiva, velocidad y cobertura.' },
  { id: 'doubles', label: 'Dobles', icon: Shield, description: 'Resistencia y roles para combatir en pareja.' },
];

function TeamMember({ id, onRemove, query }) {
  if (query.isPending) return <div className="team-member team-member--loading"><PageLoader label="" /></div>;
  if (query.isError) return <div className="team-member-error" role="alert"><Shield size={25} /><strong>No pudimos cargar este integrante</strong><button type="button" onClick={() => query.refetch()}>Reintentar</button><button type="button" onClick={() => onRemove(id)}>Quitar del equipo</button></div>;
  return <div className="team-member"><PokemonCard pokemon={{ id: query.data.id, name: query.data.name }} /><button className="team-member__remove" type="button" onClick={() => onRemove(id)}><Trash2 size={16} /> Quitar del equipo</button></div>;
}

function RecommendationCard({ member, index }) {
  const { pokemon, role, reason } = member;
  return (
    <article className="recommendation-card" style={{ '--member-index': index }}>
      <div className="recommendation-card__number">0{index + 1}</div>
      <div className="recommendation-card__art"><span /><img src={getArtworkFromPokemon(pokemon)} alt={formatPokemonName(pokemon.name)} /></div>
      <div className="recommendation-card__copy">
        <div className="recommendation-card__title"><div><small>#{String(pokemon.id).padStart(4, '0')}</small><h3>{formatPokemonName(pokemon.name)}</h3></div><Check size={18} aria-label="Recomendado" /></div>
        <div className="type-list">{pokemon.types.map(({ type }) => <TypeBadge type={type.name} key={type.name} />)}</div>
        <p className="recommendation-card__role"><Zap size={15} /> {role}</p><p>{reason}</p>
        <Link className="text-link" to={`/pokemon/${pokemon.id}`}>Ver ficha <ChevronRight size={16} /></Link>
      </div>
    </article>
  );
}

export default function TeamPage() {
  useDocumentTitle('Team Lab');
  const queryClient = useQueryClient();
  const { favorites, team, toggleTeamMember, replaceTeam, maxTeamSize } = useTrainer();
  const [format, setFormat] = useState('casual');
  const [noLegendaries, setNoLegendaries] = useState(true);
  const [preferFavorites, setPreferFavorites] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const emptySlots = Math.max(maxTeamSize - team.length, 0);
  const memberQueries = useQueries({ queries: team.map((id) => ({ queryKey: ['pokemon', id], queryFn: ({ signal }) => getPokemon(id, { signal }) })) });
  const loadedMembers = memberQueries.map((query) => query.data).filter(Boolean);

  const teamAnalysis = useMemo(() => {
    const typeCounts = new Map(); let totalStats = 0;
    loadedMembers.forEach((pokemon) => { pokemon.types.forEach(({ type }) => typeCounts.set(type.name, (typeCounts.get(type.name) ?? 0) + 1)); totalStats += pokemon.stats.reduce((total, entry) => total + entry.base_stat, 0); });
    return { types: [...typeCounts.entries()].sort((a, b) => b[1] - a[1]), weaknesses: getTeamWeaknesses(loadedMembers), averageStats: loadedMembers.length ? Math.round(totalStats / loadedMembers.length) : 0, roles: loadedMembers.map((pokemon) => inferRole(pokemon, format)) };
  }, [format, loadedMembers]);

  const generateTeam = async () => {
    setIsGenerating(true); setGenerationError('');
    try {
      const requestedIds = [...new Set([...TEAM_LAB_CANDIDATES, ...(noLegendaries ? [] : LEGENDARY_CANDIDATES), ...(preferFavorites ? favorites : [])])];
      const settled = await Promise.allSettled(requestedIds.map((id) => queryClient.fetchQuery({ queryKey: ['pokemon', id], queryFn: ({ signal }) => getPokemon(id, { signal }), staleTime: 3600000 })));
      const candidates = settled.filter((result) => result.status === 'fulfilled').map((result) => result.value);
      if (candidates.length < 6) throw new Error('Datos insuficientes');
      const previousTeamIds = recommendation?.members.map(({ pokemon }) => pokemon.id) ?? [];
      setRecommendation(buildRecommendedTeam(candidates, {
        format, noLegendaries, preferFavorites, favoriteIds: favorites, previousTeamIds,
      }));
    } catch { setGenerationError('No pudimos consultar suficientes especies. Revisá tu conexión e intentá nuevamente.'); }
    finally { setIsGenerating(false); }
  };

  const applyRecommendation = () => { if (!recommendation) return; replaceTeam(recommendation.members.map(({ pokemon }) => pokemon.id)); document.querySelector('#current-team')?.scrollIntoView({ behavior: 'smooth' }); };
  const scrollToBuilder = () => document.querySelector('#team-builder')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="team-lab-page">
      <section className="team-lab-hero"><div className="team-lab-hero__grid page-shell">
        <div className="team-lab-hero__copy"><p className="eyebrow"><Sparkles size={15} /> Inteligencia de combate NovaDex</p><h1>Tu próximo gran equipo empieza acá.</h1><p>Combiná estrategia y favoritos. Team Lab estudia estadísticas, tipos, roles y debilidades compartidas para proponerte seis compañeros con sentido.</p><button className="button" type="button" onClick={scrollToBuilder}><WandSparkles size={18} /> Crear recomendación</button></div>
        <div className="team-lab-hero__visual" aria-hidden="true"><div className="team-lab-orb"><BrainCircuit size={68} /></div><span className="team-lab-ring team-lab-ring--one" /><span className="team-lab-ring team-lab-ring--two" /><div className="lab-signal lab-signal--one"><Activity size={16} /> Analizando roles</div><div className="lab-signal lab-signal--two"><Trophy size={16} /> Balance competitivo</div></div>
      </div></section>

      <section id="team-builder" className="team-builder page-shell" aria-labelledby="builder-title">
        <div className="team-builder__intro"><div><p className="eyebrow">Configuración táctica</p><h2 id="builder-title">Decidí cómo querés jugar</h2></div><p>Una guía estratégica basada en datos generales, no una lista atada a una temporada oficial.</p></div>
        <div className="team-builder__panel">
          <fieldset className="format-picker"><legend>Estilo de equipo</legend><div>{FORMATS.map(({ id, label, icon: Icon, description }) => <label className={format === id ? 'format-option format-option--active' : 'format-option'} key={id}><input type="radio" name="format" value={id} checked={format === id} onChange={() => setFormat(id)} /><span className="format-option__icon"><Icon size={22} /></span><span><strong>{label}</strong><small>{description}</small></span><span className="format-option__check"><Check size={15} /></span></label>)}</div></fieldset>
          <div className="lab-preferences"><p>Preferencias</p>
            <label className="preference-toggle"><span className="preference-toggle__icon"><Shield size={20} /></span><span><strong>Sin legendarios</strong><small>Un equipo potente con especies obtenibles normalmente.</small></span><input type="checkbox" checked={noLegendaries} onChange={(event) => setNoLegendaries(event.target.checked)} /><span className="toggle-control" /></label>
            <label className="preference-toggle"><span className="preference-toggle__icon preference-toggle__icon--heart"><Heart size={20} /></span><span><strong>Priorizar favoritos</strong><small>{favorites.length ? `Hay ${favorites.length} favoritos para considerar.` : 'Guardá favoritos para personalizar el resultado.'}</small></span><input type="checkbox" checked={preferFavorites} onChange={(event) => setPreferFavorites(event.target.checked)} /><span className="toggle-control" /></label>
          </div>
          <div className="generate-panel"><div className="generate-panel__icon"><BrainCircuit size={30} /></div><div><strong>Motor de sinergia listo</strong><span>Evalúa más de 100 candidatos por cobertura, estadísticas y roles.</span></div><button className="button" type="button" onClick={generateTeam} disabled={isGenerating}>{isGenerating ? <><RefreshCw className="spin" size={18} /> Analizando...</> : <><Sparkles size={18} /> Generar equipo</>}</button></div>
          {generationError && <p className="lab-error" role="alert">{generationError}</p>}
        </div>
      </section>

      {recommendation && <section className="recommendation-section page-shell" aria-live="polite">
        <div className="recommendation-summary"><div><p className="eyebrow">Resultado del análisis</p><h2>Una formación hecha para vos</h2></div><div className={`strategy-badge strategy-badge--${recommendation.strategy.id}`}><small>Enfoque elegido</small><strong>{recommendation.strategy.label}</strong><span>{recommendation.strategy.description}</span></div><div className="synergy-score"><div><strong>{recommendation.score}</strong><span>/100</span></div><p>Índice de sinergia</p></div><div className="recommendation-metrics"><span><strong>{recommendation.coveredTypes}</strong> tipos cubiertos</span><span><strong>{recommendation.weaknesses.filter(({ count }) => count >= 3).length}</strong> alertas compartidas</span></div></div>
        <div className="recommendation-grid">{recommendation.members.map((member, index) => <RecommendationCard member={member} index={index} key={member.pokemon.id} />)}</div>
        <div className="recommendation-actions"><button className="button" type="button" onClick={applyRecommendation}><Check size={18} /> Usar este equipo</button><button className="button button--secondary" type="button" onClick={generateTeam}><RefreshCw size={18} /> Buscar otra formación</button></div>
      </section>}

      <section id="current-team" className="current-team page-shell">
        <header className="page-heading page-heading--team"><span className="page-heading__icon"><Shield size={25} /></span><p className="eyebrow">Panel de entrenador</p><h2>Tu equipo actual</h2><p>Podés aceptar una recomendación o elegir manualmente hasta seis compañeros.</p><div className="team-progress" aria-label={`${team.length} de ${maxTeamSize} lugares ocupados`}>{Array.from({ length: maxTeamSize }, (_, index) => <span key={index} className={index < team.length ? 'team-progress__filled' : ''} />)}<strong>{team.length}/{maxTeamSize}</strong></div></header>
        <div className="team-grid">{team.map((id, index) => <TeamMember key={id} id={id} query={memberQueries[index]} onRemove={toggleTeamMember} />)}{Array.from({ length: emptySlots }, (_, index) => <Link className="team-slot" to="/" key={`slot-${index}`}><span><Plus size={24} /></span><strong>Lugar disponible</strong><small>Elegir Pokémon</small></Link>)}</div>
        {loadedMembers.length > 0 && <section className="team-analysis" aria-labelledby="team-analysis-title"><div className="team-analysis__heading"><div><p className="eyebrow">Diagnóstico instantáneo</p><h2 id="team-analysis-title">Radiografía del equipo</h2></div><div className="team-analysis__metrics"><span><strong>{teamAnalysis.types.length}</strong> tipos presentes</span><span><strong>{teamAnalysis.averageStats}</strong> promedio base</span></div></div><div className="analysis-columns"><div><h3>Cobertura elemental</h3><div className="team-type-list">{teamAnalysis.types.map(([type, count]) => <div key={type}><TypeBadge type={type} /><strong>×{count}</strong></div>)}</div></div><div><h3>Debilidades frecuentes</h3><div className="weakness-list">{teamAnalysis.weaknesses.slice(0, 6).map(({ type, count }) => <div key={type}><span style={{ '--weakness-color': TYPE_BY_KEY[type]?.color }}>{TYPE_BY_KEY[type]?.label ?? type}</span><strong>{count} vulnerables</strong></div>)}</div></div><div><h3>Roles detectados</h3><ul className="role-list">{teamAnalysis.roles.map((role, index) => <li key={`${role}-${index}`}><Zap size={14} /> {role}</li>)}</ul></div></div></section>}
      </section>
    </div>
  );
}
