import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from '@/App';
import './styles.css';

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

const root = document.getElementById('root')!;

if (import.meta.env.PROD) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
