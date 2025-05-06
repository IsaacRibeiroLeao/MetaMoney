import React, { useState } from 'react';
import { Categoria } from '../types';

interface CategoriaFormProps {
  onSubmit: (categoria: Categoria) => void;
  initialCategoria?: Categoria;
}

const defaultCategoria: Categoria = {
  nome: '',
  ordem: 0
};

const CategoriaForm: React.FC<CategoriaFormProps> = ({ onSubmit, initialCategoria }) => {
  const [categoria, setCategoria] = useState<Categoria>(initialCategoria || defaultCategoria);
  const [errors, setErrors] = useState<{nome?: string}>({});

  const validate = (): boolean => {
    const newErrors: {nome?: string} = {};
    
    if (!categoria.nome.trim()) {
      newErrors.nome = 'Nome da categoria é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(categoria);
      
      // Reset form if it's not an edit
      if (!initialCategoria) {
        setCategoria(defaultCategoria);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setCategoria(prev => ({
      ...prev,
      [name]: name === 'ordem' ? (value === '' ? '' : parseInt(value) || 0) : value
    }));
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light">
        <h5 className="mb-0 d-flex align-items-center">
          <i className={`bi ${initialCategoria ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {initialCategoria ? 'Editar Categoria' : 'Nova Categoria'}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="categoriaNome" className="form-label fw-medium">Nome da Categoria</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-tag"></i></span>
              <input
                type="text"
                className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                id="categoriaNome"
                name="nome"
                value={categoria.nome}
                onChange={handleChange}
                placeholder="Ex: Bebidas, Sobremesas, etc."
                autoComplete="off"
              />
              {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="categoriaOrdem" className="form-label fw-medium">Ordem de Exibição</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-sort-numeric-down"></i></span>
              <input
                type="number"
                className="form-control"
                id="categoriaOrdem"
                name="ordem"
                value={categoria.ordem}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form-text"><i className="bi bi-info-circle me-1"></i>Números menores aparecem primeiro</div>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" className="btn btn-primary w-100 w-md-auto">
              <i className={`bi ${initialCategoria ? 'bi-check-circle' : 'bi-plus-lg'} me-1`}></i>
              {initialCategoria ? 'Atualizar' : 'Adicionar'} Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaForm;
