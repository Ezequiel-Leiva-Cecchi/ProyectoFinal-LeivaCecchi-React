import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TrainerProvider } from '../context/TrainerContext';
import TeamPage from './TeamPage';

const teamMembers = {
  25: {
    id: 25,
    name: 'pikachu',
    types: [{ type: { name: 'electric' } }],
    stats: [{ base_stat: 90, stat: { name: 'speed' } }],
  },
  448: {
    id: 448,
    name: 'lucario',
    types: [{ type: { name: 'fighting' } }, { type: { name: 'steel' } }],
    stats: [{ base_stat: 110, stat: { name: 'attack' } }],
  },
};

function renderTeam() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <TrainerProvider>
        <MemoryRouter>
          <TeamPage />
        </MemoryRouter>
      </TrainerProvider>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('panel del equipo', () => {
  it('resume la cobertura de tipos y permite quitar integrantes', async () => {
    localStorage.setItem('novadex:team', '[25,448]');
    vi.spyOn(globalThis, 'fetch').mockImplementation((request) => {
      const id = Number(String(request).match(/\/pokemon\/(\d+)/)?.[1]);
      return Promise.resolve({ ok: true, json: async () => teamMembers[id] });
    });

    renderTeam();

    expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lucario' })).toBeInTheDocument();
    expect(screen.getByText('tipos presentes').parentElement).toHaveTextContent('3 tipos presentes');

    fireEvent.click(screen.getAllByRole('button', { name: 'Quitar del equipo' })[0]);
    expect(localStorage.getItem('novadex:team')).toBe('[448]');
  });
});
