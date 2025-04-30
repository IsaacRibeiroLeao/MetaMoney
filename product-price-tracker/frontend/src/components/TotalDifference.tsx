import React, { useState, useEffect, useCallback } from 'react';
import { getFinalValue, getVendasFinalValue } from '../services/api';
import { eventService, EVENTS } from '../services/eventService';

const TotalDifference: React.FC = () => {
  const [productsTotal, setProductsTotal] = useState<number>(0);
  const [vendasTotal, setVendasTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os totais
  const fetchTotals = useCallback(async () => {
    try {
      setLoading(true);
      const [productsFinalValue, vendasFinalValue] = await Promise.all([
        getFinalValue(),
        getVendasFinalValue()
      ]);
      
      setProductsTotal(productsFinalValue.total_sum);
      setVendasTotal(vendasFinalValue.total_sum);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar totais:', err);
      setError('Falha ao carregar os valores totais.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Buscar totais imediatamente ao montar o componente
    fetchTotals();
    
    // Registrar listeners para eventos de atualização
    const handleProductsUpdated = () => fetchTotals();
    const handleVendasUpdated = () => fetchTotals();
    const handleFinalValuesUpdated = () => fetchTotals();
    
    eventService.subscribe(EVENTS.PRODUCTS_UPDATED, handleProductsUpdated);
    eventService.subscribe(EVENTS.VENDAS_UPDATED, handleVendasUpdated);
    eventService.subscribe(EVENTS.FINAL_VALUES_UPDATED, handleFinalValuesUpdated);
    
    // Limpar listeners ao desmontar o componente
    return () => {
      eventService.unsubscribe(EVENTS.PRODUCTS_UPDATED, handleProductsUpdated);
      eventService.unsubscribe(EVENTS.VENDAS_UPDATED, handleVendasUpdated);
      eventService.unsubscribe(EVENTS.FINAL_VALUES_UPDATED, handleFinalValuesUpdated);
    };
  }, [fetchTotals]);

  const difference = vendasTotal - productsTotal;
  const isProfit = difference >= 0;

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Resumo Financeiro</h4>
        {!loading && !error && (
          <span className="badge bg-secondary">
            <i className="bi bi-arrow-repeat me-1"></i>
            Atualizado
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="d-flex justify-content-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-box-seam text-primary me-2 fs-4"></i>
                  <h5 className="card-title mb-0">Total de Produtos</h5>
                </div>
                <p className="card-text display-6 fw-bold text-primary mb-0">R$ {productsTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-cart-check text-success me-2 fs-4"></i>
                  <h5 className="card-title mb-0">Total de Vendas</h5>
                </div>
                <p className="card-text display-6 fw-bold text-success mb-0">R$ {vendasTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-sm-12 col-md-4">
            <div className={`card h-100 border-0 shadow-sm ${isProfit ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                  <i className={`bi ${isProfit ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'} ${isProfit ? 'text-success' : 'text-danger'} me-2 fs-4`}></i>
                  <h5 className={`card-title mb-0 ${isProfit ? 'text-success' : 'text-danger'}`}>
                    {isProfit ? 'Lucro' : 'Prejuízo'}
                  </h5>
                </div>
                <p className={`card-text display-6 fw-bold mb-0 ${isProfit ? 'text-success' : 'text-danger'}`}>
                  R$ {Math.abs(difference).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalDifference;
