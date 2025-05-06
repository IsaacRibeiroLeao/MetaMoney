import React, { useState, useEffect } from 'react';
import { Prato, Categoria } from '../types';
import { getCategorias } from '../services/api';

interface PratoFormProps {
  onSubmit: (prato: Prato) => void;
  initialPrato?: Prato;
}

const defaultPrato: Prato = {
  nome: '',
  preco: 0,
  categoria_id: 0,
  participa_sorteio: false,
  descricao: ''
};

const PratoForm: React.FC<PratoFormProps> = ({ onSubmit, initialPrato }) => {
  const [prato, setPrato] = useState<Prato>(initialPrato || defaultPrato);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{nome?: string, preco?: string, categoria_id?: string}>({});

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await getCategorias();
        setCategorias(data);
        
        // Se não houver categoria selecionada e existirem categorias, selecione a primeira
        if (!prato.categoria_id && data.length > 0) {
          setPrato(prev => ({
            ...prev,
            categoria_id: data[0].id || 0
          }));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setLoading(false);
      }
    };
    
    fetchCategorias();
  }, []);

  const validate = (): boolean => {
    const newErrors: {nome?: string, preco?: string, categoria_id?: string} = {};
    
    if (!prato.nome.trim()) {
      newErrors.nome = 'Nome do prato é obrigatório';
    }
    
    if (prato.preco <= 0) {
      newErrors.preco = 'Preço deve ser maior que 0';
    }
    
    if (!prato.categoria_id) {
      newErrors.categoria_id = 'Categoria é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(prato);
      
      // Reset form if it's not an edit
      if (!initialPrato) {
        setPrato({
          ...defaultPrato,
          categoria_id: prato.categoria_id // Mantém a categoria selecionada
        });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setPrato(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number' 
          ? (value === '' ? '' : parseFloat(value) || 0) 
          : name === 'categoria_id'
            ? (value === '' ? '' : parseInt(value) || 0)
            : value
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light">
        <h5 className="mb-0 d-flex align-items-center">
          <i className={`bi ${initialPrato ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {initialPrato ? 'Editar Prato' : 'Novo Prato'}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label htmlFor="pratoNome" className="form-label fw-medium">Nome do Prato</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-cup-hot"></i></span>
                <input
                  type="text"
                  className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                  id="pratoNome"
                  name="nome"
                  value={prato.nome}
                  onChange={handleChange}
                  placeholder="Ex: Café Expresso, Bolo de Chocolate, etc."
                  autoComplete="off"
                />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="pratoPreco" className="form-label fw-medium">Preço</label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  type="number"
                  className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
                  id="pratoPreco"
                  name="preco"
                  step="0.01"
                  min="0"
                  value={prato.preco}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                {errors.preco && <div className="invalid-feedback">{errors.preco}</div>}
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="pratoCategoria" className="form-label fw-medium">Categoria</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-list-ul"></i></span>
              <select
                className={`form-select ${errors.categoria_id ? 'is-invalid' : ''}`}
                id="pratoCategoria"
                name="categoria_id"
                value={prato.categoria_id}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
              {errors.categoria_id && <div className="invalid-feedback">{errors.categoria_id}</div>}
            </div>
          </div>
          
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id="pratoParticipaSorteio"
                name="participa_sorteio"
                checked={prato.participa_sorteio}
                onChange={handleChange}
                role="switch"
              />
              <label className="form-check-label" htmlFor="pratoParticipaSorteio">
                <span className="d-flex align-items-center">
                  <i className="bi bi-trophy me-2 text-warning"></i>
                  Participa do Sorteio
                </span>
              </label>
            </div>
            {prato.participa_sorteio && (
              <div className="form-text mt-1 ps-4">
                <i className="bi bi-info-circle me-1"></i>
                Ao marcar esta opção, o cliente deverá informar seu nome para participar do sorteio.
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="pratoDescricao" className="form-label fw-medium">Descrição (opcional)</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-card-text"></i></span>
              <textarea
                className="form-control"
                id="pratoDescricao"
                name="descricao"
                rows={3}
                value={prato.descricao}
                onChange={handleChange}
                placeholder="Descreva os ingredientes ou detalhes do prato..."
              />
            </div>
          </div>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button type="submit" className="btn btn-primary w-100 w-md-auto">
              <i className={`bi ${initialPrato ? 'bi-check-circle' : 'bi-plus-lg'} me-1`}></i>
              {initialPrato ? 'Atualizar' : 'Adicionar'} Prato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PratoForm;
