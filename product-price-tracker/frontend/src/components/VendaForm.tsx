import React, { useState, useEffect } from 'react';
import { Venda, Product, Categoria, Prato } from '../types';
import { getCategorias, getPratos } from '../services/api';

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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check if the current venda is from a prato that participates in raffle
  const [isParticipaSorteio, setIsParticipaSorteio] = useState<boolean>(false);

  useEffect(() => {
    // Carregar categorias e pratos do banco de dados
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriasData, pratosData] = await Promise.all([
          getCategorias(),
          getPratos()
        ]);
        setCategorias(categoriasData);
        setPratos(pratosData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do cardápio:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (initialVenda) {
      setVenda(initialVenda);
      
      // Extract customer name from formatted name if it participates in raffle
      if (initialVenda.name.includes(' - ')) {
        const parts = initialVenda.name.split(' - ');
        if (parts.length > 1) {
          setCustomerName(parts[1]);
        }
      }
    }
  }, [initialVenda]);
  
  // Verificar se o prato selecionado participa do sorteio
  useEffect(() => {
    if (venda.name) {
      const pratoSelecionado = pratos.find(p => p.nome === venda.name);
      setIsParticipaSorteio(pratoSelecionado?.participa_sorteio || false);
    } else {
      setIsParticipaSorteio(false);
    }
  }, [venda.name, pratos]);

  const validate = (): boolean => {
    const newErrors: {name?: string, price?: string, customerName?: string} = {};
    
    if (!venda.name.trim()) {
      newErrors.name = 'Nome da venda é obrigatório';
    }
    
    const numericPrice = typeof venda.price === 'string' ? parseFloat(venda.price as string) || 0 : venda.price;
    if (numericPrice <= 0) {
      newErrors.price = 'Preço deve ser maior que 0';
    }
    
    // Validate customer name for pratos that participate in raffle
    if (isParticipaSorteio && !customerName.trim()) {
      newErrors.customerName = 'Nome do cliente é obrigatório para itens que participam do sorteio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Format the name for items that participate in raffle
      let formattedName = venda.name;
      if (isParticipaSorteio && customerName.trim()) {
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

{/* Customer name field for items that participate in raffle */}
{isParticipaSorteio && (
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

{/* Dynamic Categories and Menu Items */}
<div className="mt-2">
  {loading ? (
    <div className="d-flex justify-content-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  ) : (
    categorias.map((categoria) => (
      <div key={categoria.id} className="mb-3">
        <div className="fw-bold mb-1">{categoria.nome}</div>
        <div className="mb-2 d-flex flex-wrap gap-2">
          {pratos
            .filter(prato => prato.categoria_id === categoria.id)
            .map((prato) => (
              <button
                key={prato.id}
                type="button"
                className={`btn ${prato.participa_sorteio ? 'btn-outline-warning' : 'btn-outline-secondary'} btn-sm d-flex align-items-center`}
                style={{minWidth: 150}}
                onClick={() => setVenda(v => ({ ...v, name: prato.nome, price: prato.preco }))}
                disabled={disabled}
                title={prato.descricao || ''}
              >
                {prato.nome} (R$ {prato.preco})
                {prato.participa_sorteio && (
                  <span className="ms-1" title="Inclui sorteio">
                    <i className="bi bi-exclamation-triangle-fill text-danger"></i>
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>
    ))
  )}
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
