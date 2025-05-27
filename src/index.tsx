import './i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { LanguageProvider } from './LanguageContext';  

const manifestUrl = "here is your url";

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);

