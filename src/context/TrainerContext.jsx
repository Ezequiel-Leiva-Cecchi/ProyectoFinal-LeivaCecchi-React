import { useCallback, useMemo, useState } from 'react';
import { MAX_TEAM_SIZE } from '../config/pokemon';
import { TrainerContext } from './trainerContext';

const FAVORITES_KEY = 'novadex:favorites';
const TEAM_KEY = 'novadex:team';
function readStoredIds(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? '[]');
    if (!Array.isArray(stored)) return [];
    return [...new Set(stored.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  } catch {
    return [];
  }
}

function saveIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Algunos navegadores bloquean el almacenamiento en modo privado. La app
    // sigue funcionando durante la sesión aunque no pueda persistir el cambio.
  }
}

// Favoritos y equipo viven únicamente en el dispositivo: no se envía ningún
// dato personal ni se necesita una cuenta para utilizar la aplicación.
export function TrainerProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readStoredIds(FAVORITES_KEY));
  const [team, setTeam] = useState(() => readStoredIds(TEAM_KEY).slice(0, MAX_TEAM_SIZE));

  const toggleFavorite = useCallback((id) => {
    const numericId = Number(id);
    setFavorites((current) => {
      const next = current.includes(numericId)
        ? current.filter((favoriteId) => favoriteId !== numericId)
        : [...current, numericId];
      saveIds(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const toggleTeamMember = useCallback(
    (id) => {
      const numericId = Number(id);
      if (team.includes(numericId)) {
        const next = team.filter((memberId) => memberId !== numericId);
        setTeam(next);
        saveIds(TEAM_KEY, next);
        return 'removed';
      }

      if (team.length >= MAX_TEAM_SIZE) return 'limit';
      const next = [...team, numericId];
      setTeam(next);
      saveIds(TEAM_KEY, next);
      return 'added';
    },
    [team],
  );

  const value = useMemo(
    () => ({
      favorites,
      team,
      isFavorite: (id) => favorites.includes(Number(id)),
      isInTeam: (id) => team.includes(Number(id)),
      toggleFavorite,
      toggleTeamMember,
      maxTeamSize: MAX_TEAM_SIZE,
    }),
    [favorites, team, toggleFavorite, toggleTeamMember],
  );

  return <TrainerContext.Provider value={value}>{children}</TrainerContext.Provider>;
}
