import React, { useState, useEffect } from 'react';
import { Venda } from '../types';

interface VendaFormProps {
  onSubmit: (venda: Venda) => void;
  initialVenda?: Venda;
  disabled?: boolean;
}

const VendaForm: React.FC<VendaFormProps> = ({ 
  onSubmit, 
  initialVenda = { name: '', price: 0 },
  disabled = false
}) => {
  const [venda, setVenda] = useState<Venda>(initialVenda);
  const [errors, setErrors] = useState<{name?: string, price?: string}>({});

  useEffect(() => {
    setVenda(initialVenda);
  }, [initialVenda]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Para campos de preço, permitir entrada mesmo que não seja um número válido
    if (name === 'price') {
      setVenda(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value) || 0
      }));
    } else {
      setVenda(prev => ({
        ...prev,        [name]: value
      }));
    }
  };

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
      
      // Reset form if it's not an edit (no id)
      if (!venda.id) {
        setVenda({ name: '', price: 0 });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nome da Venda</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          value={venda.name}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Ex: Venda para Cliente X"
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="price" className="form-label">Preço (R$)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
          id="price"
          name="price"
          value={venda.price}
          onChange={handleChange}
          disabled={disabled}
          placeholder="0.00"
        />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={disabled}
      >
        {venda.id ? 'Atualizar Venda' : 'Adicionar Venda'}
      </button>
    </form>
  );
};

export default VendaForm;
