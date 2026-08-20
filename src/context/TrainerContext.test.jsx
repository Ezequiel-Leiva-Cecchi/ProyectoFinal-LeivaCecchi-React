import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TrainerProvider } from './TrainerContext';
import { useTrainer } from './trainerContext';

function TrainerHarness() {
  const { favorites, team, toggleFavorite, toggleTeamMember } = useTrainer();
  const [lastTeamAction, setLastTeamAction] = useState('');

  return (
    <div>
      <output aria-label="favoritos">{favorites.join(',')}</output>
      <output aria-label="equipo">{team.join(',')}</output>
      <output aria-label="resultado">{lastTeamAction}</output>
      <button type="button" onClick={() => toggleFavorite(25)}>Favorito 25</button>
      {Array.from({ length: 7 }, (_, index) => {
        const id = index + 1;
        return (
          <button type="button" key={id} onClick={() => setLastTeamAction(toggleTeamMember(id))}>
            Equipo {id}
          </button>
        );
      })}
    </div>
  );
}

describe('preferencias del entrenador', () => {
  it('agrega y quita favoritos en el almacenamiento local', () => {
    render(<TrainerProvider><TrainerHarness /></TrainerProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Favorito 25' }));
    expect(screen.getByLabelText('favoritos')).toHaveTextContent('25');
    expect(localStorage.getItem('novadex:favorites')).toBe('[25]');

    fireEvent.click(screen.getByRole('button', { name: 'Favorito 25' }));
    expect(screen.getByLabelText('favoritos')).toBeEmptyDOMElement();
  });

  it('respeta el límite de seis integrantes', () => {
    render(<TrainerProvider><TrainerHarness /></TrainerProvider>);
    for (let id = 1; id <= 7; id += 1) {
      fireEvent.click(screen.getByRole('button', { name: `Equipo ${id}` }));
    }
    expect(screen.getByLabelText('equipo').textContent.split(',')).toHaveLength(6);
    expect(screen.getByLabelText('resultado')).toHaveTextContent('limit');
  });
});
