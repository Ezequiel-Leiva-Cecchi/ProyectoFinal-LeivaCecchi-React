import { createContext, useContext } from 'react';

export const TrainerContext = createContext(null);

// El hook concentra la validación para que ningún componente lea el contexto
// por fuera del proveedor global de la aplicación.
export function useTrainer() {
  const context = useContext(TrainerContext);
  if (!context) throw new Error('useTrainer debe utilizarse dentro de TrainerProvider.');
  return context;
}
