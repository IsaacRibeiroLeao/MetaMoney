import React from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLocked: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, isLocked }) => {
  if (products.length === 0) {
    return (
      <div className="alert alert-info text-center my-3">
        Nenhum produto adicionado ainda.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th className="text-end">Preço</th>
            <th>Status</th>
            <th>Atualizado em</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={isLocked ? 'table-light' : ''}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td className="text-end">R$ {product.price.toFixed(2)}</td>
              <td>
                {isLocked ? (
                  <span className="badge bg-secondary">
                    <i className="bi bi-lock-fill me-1"></i>
                    Bloqueado
                  </span>
                ) : (
                  <span className="badge bg-success">
                    <i className="bi bi-unlock-fill me-1"></i>
                    Editável
                  </span>
                )}
              </td>
              <td>{product.timestamp}</td>
              <td className="text-center">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onEdit(product)}
                  disabled={isLocked}
                >
                  <i className="bi bi-pencil-square me-1"></i>
                  Editar
                </button>
                {!isLocked && typeof product.id === 'number' && (
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => onDelete(product.id as number)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
