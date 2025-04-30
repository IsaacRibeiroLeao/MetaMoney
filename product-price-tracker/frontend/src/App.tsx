import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ProductTracker from './components/ProductTracker';
import VendaTracker from './components/VendaTracker';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },  
});

function App() {
  const [activeTab, setActiveTab] = useState<'produtos' | 'vendas'>('produtos');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white text-center py-3">
                <h1 className="h3 mb-0">Rastreador de Preços e Vendas</h1>
              </div>
              <div className="card-body">
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'produtos' ? 'active' : ''}`}
                      onClick={() => setActiveTab('produtos')}
                    >
                      <i className="bi bi-box me-2"></i>
                      Produtos
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'vendas' ? 'active' : ''}`}
                      onClick={() => setActiveTab('vendas')}
                    >
                      <i className="bi bi-cart me-2"></i>
                      Vendas
                    </button>
                  </li>
                </ul>
                
                {activeTab === 'produtos' ? (
                  <ProductTracker />
                ) : (
                  <VendaTracker />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
