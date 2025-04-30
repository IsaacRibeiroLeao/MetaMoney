import React, { useState, useEffect, useMemo } from 'react';
import VendaForm from './VendaForm';
import VendaList from './VendaList';
import { Venda } from '../types';
import { getVendas, addVenda, updateVenda, getVendasFinalValue, lockVendasFinalValue, FinalValue } from '../services/api';

const VendaTracker: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [editingVenda, setEditingVenda] = useState<Venda | null>(null);
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
      const [vendasData, finalValueData] = await Promise.all([
        getVendas(),
        getVendasFinalValue()
      ]);
      
      setVendas(vendasData);
      setFinalValue(finalValueData);
      setIsLocked(finalValueData.is_locked);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Falha ao carregar dados. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVenda = async (venda: Venda) => {
    try {
      const newVenda = await addVenda(venda);
      setVendas(prev => [...prev, newVenda]);
      showNotification('Venda adicionada com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao adicionar venda:', err);
      showNotification('Falha ao adicionar venda. Tente novamente.', 'danger');
    }
  };

  const handleUpdateVenda = async (venda: Venda) => {
    try {
      const updatedVenda = await updateVenda(venda);
      setVendas(prev => 
        prev.map(v => v.id === updatedVenda.id ? updatedVenda : v)
      );
      setEditingVenda(null);
      showNotification('Venda atualizada com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao atualizar venda:', err);
      showNotification('Falha ao atualizar venda. Tente novamente.', 'danger');
    }
  };

  const handleLockFinalValue = async () => {
    try {
      const result = await lockVendasFinalValue();
      setFinalValue(result);
      setIsLocked(true);
      showNotification('Valor final das vendas bloqueado com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao bloquear valor final das vendas:', err);
      showNotification('Falha ao bloquear valor final das vendas. Tente novamente.', 'danger');
    }
  };

  const handleEditClick = (venda: Venda) => {
    setEditingVenda(venda);
  };

  const handleSubmit = (venda: Venda) => {
    if (venda.id) {
      handleUpdateVenda(venda);
    } else {
      handleAddVenda(venda);
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

  // Calculate the total sum of all venda prices
  const totalSum = useMemo(() => {
    if (isLocked && finalValue) {
      return finalValue.total_sum;
    }
    return vendas.reduce((sum, venda) => sum + venda.price, 0);
  }, [vendas, isLocked, finalValue]);

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
          {editingVenda ? (
            <div>
              <h5 className="mb-3">Editar Venda</h5>
              <VendaForm 
                onSubmit={handleSubmit} 
                initialVenda={editingVenda} 
                disabled={isLocked}
              />
              <div className="mb-4">
                <button 
                  className="btn btn-link p-0" 
                  onClick={() => setEditingVenda(null)}
                >
                  Cancelar edição e adicionar nova venda
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h5 className="mb-3">Adicionar Nova Venda</h5>
              <VendaForm onSubmit={handleSubmit} disabled={isLocked} />
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
                disabled={vendas.length === 0}
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
      
      <h5 className="mb-3">Lista de Vendas</h5>
      
      {loading ? (
        <div className="text-center p-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando vendas...</p>
        </div>
      ) : (
        <VendaList 
          vendas={vendas} 
          onEdit={handleEditClick} 
          isLocked={isLocked} 
        />
      )}
    </div>
  );
};

export default VendaTracker;
