import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite compila la aplicación y Vitest reutiliza la misma configuración.
export default defineConfig({
  // GitHub Pages publica el proyecto dentro de /nombre-del-repo/. Vercel y el
  // desarrollo local conservan la raíz habitual cuando esta variable no existe.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
