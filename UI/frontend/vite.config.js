import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The backend only allows requests from port 5173 (see WebSecurityConfig).
  // strictPort makes Vite stop with an error instead of silently moving to another port.
  server: { port: 5173, strictPort: true },
});
