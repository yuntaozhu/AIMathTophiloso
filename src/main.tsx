import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import MingQingSimulatorPage from './pages/MingQingSimulatorPage.tsx';
import './index.css';

function resolveRoot() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#/sim/ming-qing')) {
    return <MingQingSimulatorPage />;
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {resolveRoot()}
  </StrictMode>,
);
