import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RuslanPortfolio from './RuslanPortfolio';
import CVPortfolio from './CVPortfolio';
import App from './App';
import { PortfolioProvider } from './PortfolioProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RuslanPortfolio />} />
          <Route path="/cv" element={<CVPortfolio />} />
          <Route path="/edit" element={<App />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  </React.StrictMode>
);