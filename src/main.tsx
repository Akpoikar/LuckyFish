import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/index.css';
import './styles/betting.css';
import './styles/loading.css';
import './styles/menu.css';
import './styles/multipliers.css';
import './styles/bubble-ring.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
