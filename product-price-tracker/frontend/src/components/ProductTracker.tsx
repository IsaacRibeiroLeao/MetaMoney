import React, { useState, useEffect, useMemo } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Product } from '../types';
import { getProducts, addProduct, updateProduct, getFinalValue, lockFinalValue, FinalValue } from '../services/api';

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
          {error}
        </div>
      )}

      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(prev => ({ ...prev, show: false }))}></button>
        </div>
      )}

      {!isLocked && (
        <div>
          {editingProduct ? (
            <div>
              <h5 className="mb-3">Editar Produto</h5>
              <ProductForm 
                onSubmit={handleSubmit} 
                initialProduct={editingProduct} 
                disabled={isLocked}
              />
              <div className="mb-4">
                <button 
                  className="btn btn-link p-0" 
                  onClick={() => setEditingProduct(null)}
                >
                  Cancelar edição e adicionar novo produto
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h5 className="mb-3">Adicionar Novo Produto</h5>
              <ProductForm onSubmit={handleSubmit} disabled={isLocked} />
            </div>
          )}
        </div>
      )}

      <hr className="my-4" />
      
      <div className={`card mb-4 ${isLocked ? 'bg-light' : ''}`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <strong>Valor Total: </strong><strong style={{ fontSize: '1.2em' }}>R$ {totalSum.toFixed(2)}</strong>
            </h5>
            {!isLocked && (
              <button 
                className="btn btn-danger" 
                onClick={handleLockFinalValue}
                disabled={products.length === 0}
              >
                <i className="bi bi-lock-fill me-2"></i>
                Bloquear Valor Final
              </button>
            )}
            {isLocked && (
              <span className="badge bg-danger p-2">
                <i className="bi bi-lock-fill me-2"></i>
                Valor Final Bloqueado
              </span>
            )}
          </div>
        </div>
      </div>
      
      <h5 className="mb-3">Lista de Produtos</h5>
      
      {loading ? (
        <div className="text-center p-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando produtos...</p>
        </div>
      ) : (
        <ProductList 
          products={products} 
          onEdit={handleEditClick} 
          isLocked={isLocked}
        />
      )}
    </div>
  );
};

export default ProductTracker;
