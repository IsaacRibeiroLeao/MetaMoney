import React, { useState, useEffect, useMemo } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Product } from '../types';
import { getProducts, addProduct, updateProduct, getFinalValue, lockFinalValue, FinalValue } from '../services/api';
import { eventService, EVENTS } from '../services/eventService';

const ProductTracker: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [finalValue, setFinalValue] = useState<FinalValue | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'danger' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, finalValueData] = await Promise.all([
        getProducts(),
        getFinalValue()
      ]);
      
      setProducts(productsData);
      setFinalValue(finalValueData);
      setIsLocked(finalValueData.is_locked);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (product: Product) => {
    try {
      const newProduct = await addProduct(product);
      setProducts(prev => [...prev, newProduct]);
      showNotification('Produto adicionado com sucesso!', 'success');
      // Emitir evento de atualização de produtos
      eventService.emit(EVENTS.PRODUCTS_UPDATED);
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      showNotification('Falha ao adicionar produto. Tente novamente.', 'danger');
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const updatedProduct = await updateProduct(product);
      setProducts(prev => 
        prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      setEditingProduct(null);
      showNotification('Produto atualizado com sucesso!', 'success');
      // Emitir evento de atualização de produtos
      eventService.emit(EVENTS.PRODUCTS_UPDATED);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      showNotification('Falha ao atualizar produto. Tente novamente.', 'danger');
    }
  };

  const handleLockFinalValue = async () => {
    try {
      const result = await lockFinalValue();
      setFinalValue(result);
      setIsLocked(true);
      showNotification('Valor final bloqueado com sucesso!', 'success');
      // Emitir evento de atualização de valores finais
      eventService.emit(EVENTS.FINAL_VALUES_UPDATED);
    } catch (err) {
      console.error('Erro ao bloquear valor final:', err);
      showNotification('Falha ao bloquear valor final. Tente novamente.', 'danger');
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSubmit = (product: Product) => {
    if (product.id) {
      handleUpdateProduct(product);
    } else {
      handleAddProduct(product);
    }
  };

  const showNotification = (message: string, type: 'success' | 'danger' | 'info') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Calculate the total sum of all product prices
  const totalSum = useMemo(() => {
    if (isLocked && finalValue) {
      return finalValue.total_sum;
    }
    return products.reduce((sum, product) => sum + product.price, 0);
  }, [products, isLocked, finalValue]);

  return (
    <div>
      {error && (
        <div className="alert alert-danger mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${notification.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(prev => ({ ...prev, show: false }))}></button>
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 d-flex align-items-center">
            <i className="bi bi-box-seam text-primary me-2"></i>
            Produtos
          </h5>
          <div>
            {isLocked ? (
              <div className="badge bg-info text-dark d-flex align-items-center p-2">
                <i className="bi bi-lock-fill me-1"></i>
                <span>Valor final: R$ {finalValue?.total_sum.toFixed(2)}</span>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleLockFinalValue}
                disabled={products.length === 0}
              >
                <i className="bi bi-lock me-1"></i>
                <span className="d-none d-sm-inline">Bloquear Valor Final</span>
                <span className="d-inline d-sm-none">Bloquear</span>
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2 text-muted">Carregando produtos...</p>
            </div>
          ) : (
            <>
              {!isLocked && (
                <div className="mb-4">
                  <h6 className="mb-3 text-muted">
                    <i className="bi bi-plus-circle me-2"></i>
                    Adicionar Novo Produto
                  </h6>
                  {editingProduct ? (
                    <>
                      <ProductForm
                        onSubmit={handleSubmit}
                        initialProduct={editingProduct}
                        disabled={isLocked} />
                      <div className="mt-2">
                        <button
                          className="btn btn-link p-0"
                          onClick={() => setEditingProduct(null)}
                        >
                          <i className="bi bi-arrow-left me-1"></i>
                          Cancelar edição e adicionar novo produto
                        </button>
                      </div>
                    </>
                  ) : (
                    <ProductForm onSubmit={handleSubmit} disabled={isLocked} />
                  )}
                </div>
              )}

              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 text-muted">
                    <i className="bi bi-list-ul me-2"></i>
                    Lista de Produtos
                  </h6>
                  <div className="badge bg-primary p-2">
                    <i className="bi bi-cash-coin me-1"></i>
                    Total: R$ {totalSum.toFixed(2)}
                  </div>
                </div>

                <div className="table-responsive">
                  <ProductList
                    products={products}
                    onEdit={handleEditClick}
                    isLocked={isLocked} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast de notificação */}
      {notification.show && (
        <div
          className={`toast show position-fixed bottom-0 end-0 m-3 text-white bg-${notification.type}`}
          role="alert"
          style={{ zIndex: 1060 }}
        >
          <div className="toast-header">
            <i className={`bi bi-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
            <strong className="me-auto">Notificação</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            ></button>
          </div>
          <div className="toast-body">
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTracker;
