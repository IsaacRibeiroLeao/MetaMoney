import React from 'react';
import { Venda } from '../types';

interface VendaListProps {
  vendas: Venda[];
  onEdit: (venda: Venda) => void;
  onDelete: (id: number) => void;
  isLocked: boolean;
}

const VendaList: React.FC<VendaListProps> = ({ vendas, onEdit, onDelete, isLocked }) => {
  if (vendas.length === 0) {
    return (
      <div className="alert alert-info">
        Nenhuma venda adicionada ainda. Use o formulário acima para adicionar vendas.
      </div>
    );
  }

  return (
    <div className="table-responsive-sm">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="w-50">Nome</th>
            <th className="text-end">Preço (R$)</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map(venda => (
            <tr key={venda.id}>
              <td className="text-break">{venda.name}</td>
              <td className="text-end">{venda.price.toFixed(2)}</td>
              <td className="text-center">
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
                  {!isLocked && (
                    <button
                      className="btn btn-sm btn-outline-primary w-100 w-sm-auto"
                      onClick={() => onEdit(venda)}
                    >
                      <i className="bi bi-pencil-fill me-1"></i>
                      Editar
                    </button>
                  )}
                  {isLocked && (
                    <span className="badge bg-secondary w-100 w-sm-auto">
                      <i className="bi bi-lock-fill me-1"></i>
                      Bloqueado
                    </span>
                  )}
                  {!isLocked && typeof venda.id === 'number' && (
                    <button
                      className="btn btn-sm btn-outline-danger w-100 w-sm-auto"
                      onClick={() => onDelete(venda.id as number)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendaList;
