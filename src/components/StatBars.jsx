import { STAT_LABELS } from '../config/pokemon';
import { formatPokemonName } from '../utils/pokemon';

export default function StatBars({ stats = [] }) {
  const total = stats.reduce((sum, entry) => sum + entry.base_stat, 0);

  return (
    <div className="stats-panel">
      <div className="stats-panel__summary">
        <span>Total base</span>
        <strong>{total}</strong>
      </div>
      <div className="stats-list">
        {stats.map((entry) => {
          const key = entry.stat.name;
          const value = entry.base_stat;
          return (
            <div className="stat-row" key={key}>
              <span>{STAT_LABELS[key] ?? formatPokemonName(key)}</span>
              <strong>{value}</strong>
              <div className="stat-row__track" aria-hidden="true">
                <span style={{ '--stat-value': `${Math.min((value / 255) * 100, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
