import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ProductTracker from './components/ProductTracker';
import VendaTracker from './components/VendaTracker';
import TotalDifference from './components/TotalDifference';
import CardapioManager from './components/CardapioManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [activeTab, setActiveTab] = useState<'Valores' | 'vendas' | 'cardapio'>('Valores');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="container-fluid px-0">
        {/* Header fixo no topo */}
        <header className="sticky-top bg-primary text-white shadow-sm">
          <div className="container py-2">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0 d-flex align-items-center">
                <img 
                  src="/images/XtremeConf.png" 
                  alt="XtremeConfApp Logo" 
                  className="me-2" 
                  style={{ height: '60px', width: 'auto', borderRadius: '4px' }}
                />
                <span className="d-none d-sm-inline">Rastreador de Preços e Vendas</span>
                <span className="d-inline d-sm-none">XtremeConfApp</span>
              </h1>
              <div className="btn-group">
                <button 
                  className={`btn ${activeTab === 'Valores' ? 'btn-light' : 'btn-outline-light'} btn-sm`}
                  onClick={() => setActiveTab('Valores')}
                >
                  <i className="bi bi-box me-1"></i>
                  <span className="d-none d-md-inline">Valores</span>
                </button>
                <button 
                  className={`btn ${activeTab === 'vendas' ? 'btn-light' : 'btn-outline-light'} btn-sm`}
                  onClick={() => setActiveTab('vendas')}
                >
                  <i className="bi bi-cart me-1"></i>
                  <span className="d-none d-md-inline">Vendas</span>
                </button>
                <button 
                  className={`btn ${activeTab === 'cardapio' ? 'btn-light' : 'btn-outline-light'} btn-sm`}
                  onClick={() => setActiveTab('cardapio')}
                >
                  <i className="bi bi-menu-button-wide me-1"></i>
                  <span className="d-none d-md-inline">Cardápio</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container my-3">
          {/* Componente de diferença entre produtos e vendas */}
          <TotalDifference />
          
          <div className="mt-4">
            {activeTab === 'Valores' ? (
              <ProductTracker />
            ) : activeTab === 'vendas' ? (
              <VendaTracker />
            ) : (
              <CardapioManager />
            )}
          </div>
        </main>

        {/* Removido o rodapé conforme solicitado */}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </ThemeProvider>
  );
}

export default App;
