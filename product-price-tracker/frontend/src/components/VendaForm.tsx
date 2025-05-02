import React, { useState, useEffect } from 'react';
import { Venda, Product } from '../types';
import { STATIC_PRODUCTS, COMBO_PRODUCTS } from '../services/api';

interface VendaFormProps {
  onSubmit: (venda: Venda) => void;
  initialVenda?: Venda;
  disabled?: boolean;
}

const defaultVenda: Venda = {
  name: '',
  price: 0
};

const VendaForm: React.FC<VendaFormProps> = ({ onSubmit, initialVenda, disabled = false }) => {
  const [venda, setVenda] = useState<Venda>(initialVenda || defaultVenda);
  const [errors, setErrors] = useState<{name?: string, price?: string}>({});

  useEffect(() => {
    if (initialVenda) {
      setVenda(initialVenda);
    }
  }, [initialVenda]);

  const validate = (): boolean => {
    const newErrors: {name?: string, price?: string} = {};
    
    if (!venda.name.trim()) {
      newErrors.name = 'Nome da venda é obrigatório';
    }
    
    if (venda.price <= 0) {
      newErrors.price = 'Preço deve ser maior que 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(venda);
      
      // Reset form if it's not an edit
      if (!initialVenda) {
        setVenda(defaultVenda);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVenda(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="vendaName" className="form-label">Nome da Venda</label>
<input
  type="text"
  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
  id="vendaName"
  name="name"
  value={venda.name}
  onChange={handleChange}
  disabled={disabled}
/>
{errors.name && <div className="invalid-feedback">{errors.name}</div>}

{/* Static Options Below Nome da Venda */}
<div className="mt-2">
  <div className="fw-bold mb-1">Pratos</div>
  <div className="mb-2 d-flex flex-wrap gap-2">
    {STATIC_PRODUCTS.filter(p => ['Tradicional (300ml)', 'Porção de Paçoca', 'Copo de Creme de Galinha'].includes(p.name)).map((item, idx) => (
      <button
        key={item.name}
        type="button"
        className="btn btn-outline-secondary btn-sm"
        style={{minWidth: 120}}
        onClick={() => setVenda(v => ({ ...v, name: item.name, price: item.price }))}
        disabled={disabled}
      >
        {item.name} (R$ {item.price})
      </button>
    ))}
  </div>
  <div className="fw-bold mb-1">Bebidas</div>
  <div className="mb-2 d-flex flex-wrap gap-2">
    {STATIC_PRODUCTS.filter(p => ['Arrumadinho', 'Suco', 'Refrigerante'].includes(p.name)).map((item, idx) => (
      <button
        key={item.name}
        type="button"
        className="btn btn-outline-info btn-sm"
        style={{minWidth: 120}}
        onClick={() => setVenda(v => ({ ...v, name: item.name, price: item.price }))}
        disabled={disabled}
      >
        {item.name} (R$ {item.price})
      </button>
    ))}
  </div>
  <div className="fw-bold mb-1">Combos</div>
  <div className="mb-2 d-flex flex-wrap gap-2">
    {COMBO_PRODUCTS.map((item: Product, idx: number) => (
      <button
        key={item.name}
        type="button"
        className={`btn btn-outline-warning btn-sm d-flex align-items-center`}
        style={{minWidth: 180}}
        onClick={() => setVenda(v => ({ ...v, name: item.name, price: item.price }))}
        disabled={disabled}
      >
        {item.name} (R$ {item.price})
        {item.name === 'Combo Misericórdia' && (
          <span className="ms-1" title="Inclui sorteio"><i className="bi bi-exclamation-triangle-fill text-danger"></i></span>
        )}
      </button>
    ))}
  </div>
</div>
            </div>
            <div className="col-md-6">
              <label htmlFor="vendaPrice" className="form-label">Preço</label>
              <input
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="vendaPrice"
                name="price"
                step="0.01"
                min="0"
                value={venda.price}
                onChange={handleChange}
                disabled={disabled}
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={disabled}
            >
              {initialVenda?.id ? 'Atualizar Venda' : 'Adicionar Venda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendaForm;
