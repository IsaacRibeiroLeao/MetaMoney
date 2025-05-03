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
  price: '' as unknown as number
};

const VendaForm: React.FC<VendaFormProps> = ({ onSubmit, initialVenda, disabled = false }) => {
  const [venda, setVenda] = useState<Venda>(initialVenda || defaultVenda);
  const [customerName, setCustomerName] = useState<string>('');
  const [errors, setErrors] = useState<{name?: string, price?: string, customerName?: string}>({});
  
  // Check if the current venda is one of the special combos that needs a customer name
  const isSpecialCombo = venda.name === 'Combo Misericórdia' || 
                        venda.name === 'Combo dos Apóstolos' || 
                        venda.name === 'Combo Casal Ungido';

  useEffect(() => {
    if (initialVenda) {
      setVenda(initialVenda);
      
      // Extract customer name from formatted name if it's a special combo
      const specialCombos = ['Combo Misericórdia', 'Combo dos Apóstolos', 'Combo Casal Ungido'];
      const comboName = specialCombos.find(combo => initialVenda.name.startsWith(combo));
      
      if (comboName && initialVenda.name.includes(' - ')) {
        const extractedName = initialVenda.name.substring(comboName.length + 3); // +3 for ' - '
        setCustomerName(extractedName);
      }
    }
  }, [initialVenda]);

  const validate = (): boolean => {
    const newErrors: {name?: string, price?: string, customerName?: string} = {};
    
    if (!venda.name.trim()) {
      newErrors.name = 'Nome da venda é obrigatório';
    }
    
    const numericPrice = typeof venda.price === 'string' ? parseFloat(venda.price as string) || 0 : venda.price;
    if (numericPrice <= 0) {
      newErrors.price = 'Preço deve ser maior que 0';
    }
    
    // Validate customer name for special combos
    if (isSpecialCombo && !customerName.trim()) {
      newErrors.customerName = 'Nome do cliente é obrigatório para este combo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Format the name for special combos
      let formattedName = venda.name;
      if (isSpecialCombo && customerName.trim()) {
        formattedName = `${venda.name} - ${customerName.trim()}`;
      }
      
      // Ensure price is a number before submitting
      const submittedVenda = {
        ...venda,
        name: formattedName,
        price: typeof venda.price === 'string' ? parseFloat(venda.price as string) || 0 : venda.price
      };
      
      onSubmit(submittedVenda);
      
      // Reset form if it's not an edit
      if (!initialVenda) {
        setVenda(defaultVenda);
        setCustomerName('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerName') {
      setCustomerName(value);
    } else {
      setVenda(prev => ({
        ...prev,
        [name]: name === 'price' ? (value === '' ? '' : parseFloat(value) || 0) : value
      }));
    }
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

{/* Customer name field for special combos */}
{isSpecialCombo && (
  <div className="mt-2">
    <label htmlFor="customerName" className="form-label">Nome do Cliente</label>
    <input
      type="text"
      className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
      id="customerName"
      name="customerName"
      value={customerName}
      onChange={handleChange}
      disabled={disabled}
      placeholder="Nome para o sorteio"
    />
    {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
  </div>
)}

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
        {(item.name === 'Combo Misericórdia' || item.name === 'Combo dos Apóstolos' || item.name === 'Combo Casal Ungido') && (
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
