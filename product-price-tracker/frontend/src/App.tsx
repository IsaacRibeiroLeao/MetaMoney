import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ProductTracker from './components/ProductTracker';
import VendaTracker from './components/VendaTracker';
import TotalDifference from './components/TotalDifference';

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
      <div className="container-fluid px-0">
        {/* Header fixo no topo */}
        <header className="sticky-top bg-primary text-white shadow-sm">
          <div className="container py-2">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0 d-flex align-items-center">
                <i className="bi bi-graph-up-arrow me-2"></i>
                <span className="d-none d-sm-inline">Rastreador de Preços e Vendas</span>
                <span className="d-inline d-sm-none">MetaMoney</span>
              </h1>
              <div className="btn-group">
                <button 
                  className={`btn ${activeTab === 'produtos' ? 'btn-light' : 'btn-outline-light'} btn-sm`}
                  onClick={() => setActiveTab('produtos')}
                >
                  <i className="bi bi-box me-1"></i>
                  <span className="d-none d-md-inline">Produtos</span>
                </button>
                <button 
                  className={`btn ${activeTab === 'vendas' ? 'btn-light' : 'btn-outline-light'} btn-sm`}
                  onClick={() => setActiveTab('vendas')}
                >
                  <i className="bi bi-cart me-1"></i>
                  <span className="d-none d-md-inline">Vendas</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container my-3">
          {/* Componente de diferença entre produtos e vendas */}
          <TotalDifference />
          
          <div className="mt-4">
            {activeTab === 'produtos' ? (
              <ProductTracker />
            ) : (
              <VendaTracker />
            )}
          </div>
        </main>

        {/* Removido o rodapé conforme solicitado */}
      </div>
    </ThemeProvider>
  );
}

export default App;
