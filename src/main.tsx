import React from 'react';
import ReactDOM from 'react-dom/client';
import RuslanPortfolio from './RuslanPortfolio';
import { PortfolioProvider } from './PortfolioProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortfolioProvider>
      <RuslanPortfolio />
    </PortfolioProvider>
  </React.StrictMode>
);