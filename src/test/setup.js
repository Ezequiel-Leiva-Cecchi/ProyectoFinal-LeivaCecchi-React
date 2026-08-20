import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cada prueba recibe un DOM y un almacenamiento local limpios.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
