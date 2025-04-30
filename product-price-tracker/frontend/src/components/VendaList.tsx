import React from 'react';
import { Venda } from '../types';

interface VendaListProps {
  vendas: Venda[];
  onEdit: (venda: Venda) => void;
  isLocked: boolean;
}

const VendaList: React.FC<VendaListProps> = ({ vendas, onEdit, isLocked }) => {
  if (vendas.length === 0) {
    return (
      <div className="alert alert-info">
        Nenhuma venda adicionada ainda. Use o formulário acima para adicionar vendas.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th>Nome</th>
            <th>Preço (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map(venda => (
            <tr key={venda.id}>
              <td>{venda.name}</td>
              <td>{venda.price.toFixed(2)}</td>
              <td>
                {!isLocked && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(venda)}
                  >
                    <i className="bi bi-pencil-fill me-1"></i>
                    Editar
                  </button>
                )}
                {isLocked && (
                  <span className="badge bg-secondary">
                    <i className="bi bi-lock-fill me-1"></i>
                    Bloqueado
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendaList;
