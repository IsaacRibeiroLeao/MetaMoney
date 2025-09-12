import React, { useState, useEffect, useMemo } from 'react';
import { Venda, Categoria, Prato } from '../types';
import { getCategorias, getPratos } from '../services/api';

interface VendaFormProps {
  onSubmit: (venda: Venda) => void;
  onSubmitMany?: (vendas: Venda[]) => void;
  initialVenda?: Venda;
  disabled?: boolean;
}

const defaultVenda: Venda = { name: '', price: '' as unknown as number };

type SelectedMap = Record<number, { prato: Prato; qty: number }>;

const VendaForm: React.FC<VendaFormProps> = ({ onSubmit, onSubmitMany, initialVenda, disabled = false }) => {
  const [venda, setVenda] = useState<Venda>(initialVenda || defaultVenda);
  const [customerName, setCustomerName] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; price?: string; customerName?: string; batch?: string }>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedMap, setSelectedMap] = useState<SelectedMap>({});
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<number>>(new Set());

  const toggleCategory = (id: number) => {
    setOpenCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriasData, pratosData] = await Promise.all([getCategorias(), getPratos()]);
        setCategorias(categoriasData);
        setPratos(pratosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialVenda) setVenda(initialVenda);
  }, [initialVenda]);

  const selectedList = useMemo(() => Object.values(selectedMap), [selectedMap]);
  const anySelected = selectedList.length > 0;
  const anySelectedParticipaSorteio = selectedList.some((s) => s.prato.participa_sorteio);
  const selectedTotalCount = selectedList.reduce((sum, s) => sum + s.qty, 0);
  const selectedTotalValue = selectedList.reduce((sum, s) => sum + s.prato.preco * s.qty, 0);

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anySelected) { setErrors({ batch: 'Selecione pelo menos um item' }); return; }
    if (anySelectedParticipaSorteio && !customerName.trim()) { setErrors({ customerName: 'Nome obrigatório para itens do sorteio' }); return; }

    const vendasToAdd: Venda[] = [];
    for (const { prato, qty } of selectedList) {
      const name = prato.participa_sorteio && customerName.trim() ? `${prato.nome} - ${customerName.trim()}` : prato.nome;
      for (let i = 0; i < qty; i++) vendasToAdd.push({ name, price: prato.preco } as Venda);
    }
    onSubmitMany?.(vendasToAdd);
    setSelectedMap({});
    setCustomerName('');
  };

  const toggleSelect = (prato: Prato) => {
    setSelectedMap((prev) => {
      const next = { ...prev };
      if (next[prato.id]) delete next[prato.id]; else next[prato.id] = { prato, qty: 1 };
      return next;
    });
  };

  const setQty = (pratoId: number, qty: number) => {
    setSelectedMap((prev) => {
      const entry = prev[pratoId];
      if (!entry) return prev;
      return { ...prev, [pratoId]: { ...entry, qty: Math.max(1, Math.floor(qty || 1)) } };
    });
  };

  const removeSelected = (pratoId: number) => {
    setSelectedMap((prev) => { const next = { ...prev }; delete next[pratoId]; return next; });
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(venda.price);
    if (!venda.name.trim() || !(price > 0)) { setErrors({ name: 'Nome e preço são obrigatórios' }); return; }
    onSubmit({ ...venda, price });
    setVenda(defaultVenda);
  };

  const pratosByCategoria = (categoriaId: number) =>
    pratos.filter((p) => Number(p.categoria_id) === Number(categoriaId));

  return (
    <div className="d-flex flex-column gap-4">
      {/* ===== BATCH SECTION ===== */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0"><i className="bi bi-list-check me-2"></i>Adicionar várias vendas</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center"><div className="spinner-border text-primary" /></div>
          ) : (
            categorias.length === 0 ? (
              <div className="alert alert-warning mb-0">Nenhuma categoria encontrada.</div>
            ) : (
              categorias.map((categoria) => (
                <div key={categoria.id} className="mb-3">
                  <div className="fw-bold mb-2">{categoria.nome}</div>
                  <div className="row g-2">
                    {pratosByCategoria(categoria.id).length === 0 ? (
                      <div className="text-muted ps-2">Nenhum prato nesta categoria</div>
                    ) : (
                      pratosByCategoria(categoria.id).map((prato) => {
                        const selected = !!selectedMap[prato.id];
                        const qty = selectedMap[prato.id]?.qty ?? 1;
                        return (
                          <div className="col-12 col-sm-6" key={prato.id}>
                            <div className={`border rounded p-2 d-flex flex-wrap align-items-center ${selected ? 'bg-light' : ''}`}>
                              <div className="form-check flex-grow-1">
                                <input type="checkbox" className="form-check-input" id={`p-${prato.id}`}
                                  checked={selected} onChange={() => toggleSelect(prato)} />
                                <label htmlFor={`p-${prato.id}`} className="form-check-label">
                                  {prato.nome} <span className="badge bg-secondary">R$ {prato.preco}</span>
                                </label>
                              </div>
                              {selected && (
                                <div className="d-flex align-items-center mt-2 mt-sm-0">
                                  <input type="number" min={1} value={qty}
                                    onChange={(e) => setQty(prato.id, Number(e.target.value))}
                                    className="form-control form-control-sm me-2" style={{ width: 70 }} />
                                  <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={() => removeSelected(prato.id)}><i className="bi bi-x-lg"></i></button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))
            )
          )}

          {anySelectedParticipaSorteio && (
            <div className="mt-3">
              <label className="form-label">Nome do Cliente (para itens do sorteio)</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="form-control" />
              {errors.customerName && <div className="invalid-feedback d-block">{errors.customerName}</div>}
            </div>
          )}
          {errors.batch && <div className="text-danger mt-2 small">{errors.batch}</div>}
        </div>
        <div className="card-footer d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <small className="text-muted">Selecionados: {selectedTotalCount} • Total: R$ {selectedTotalValue.toFixed(2)}</small>
            <button
              className="btn btn-success w-100 w-md-auto"
              disabled={!anySelected || disabled}
              onClick={handleBatchSubmit}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Adicionar Selecionados
            </button>
        </div>
      </div>

      {/* ===== SINGLE SECTION ===== */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0"><i className="bi bi-plus me-2"></i>Adicionar venda única</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSingleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Nome</label>
                <input className="form-control" value={venda.name}
                  onChange={(e) => setVenda((v) => ({ ...v, name: e.target.value }))} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Preço</label>
                <input type="number" className="form-control" value={venda.price}
                  onChange={(e) => setVenda((v) => ({ ...v, price: Number(e.target.value) }))} />
              </div>
            </div>

            {loading ? (
              <div className="text-center my-3"><div className="spinner-border text-primary" /></div>
            ) : (
              <div className="accordion" id="accordionCategorias">
                {categorias.length === 0 && (
                  <div className="alert alert-warning">Nenhuma categoria encontrada.</div>
                )}
                {categorias.map((categoria) => {
                  const isOpen = openCategoryIds.has(Number(categoria.id));
                  return (
                    <div className="accordion-item" key={categoria.id}>
                      <h2 className="accordion-header">
                        <button
                          type="button"
                          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                          onClick={() => toggleCategory(Number(categoria.id))}
                          aria-expanded={isOpen}
                        >
                          {categoria.nome}
                        </button>
                      </h2>
                      <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
                        <div className="accordion-body d-flex flex-wrap gap-2">
                          {pratosByCategoria(Number(categoria.id)).length === 0 ? (
                            <span className="text-muted">Nenhum prato nesta categoria</span>
                          ) : (
                            pratosByCategoria(Number(categoria.id)).map((prato) => (
                              <button
                                key={prato.id}
                                type="button"
                                className={`btn btn-sm ${prato.participa_sorteio ? 'btn-outline-warning' : 'btn-outline-secondary'}`}
                                style={{ minWidth: 120 }}
                                onClick={() => setVenda((v) => ({ ...v, name: prato.nome, price: prato.preco }))}
                                disabled={disabled}
                              >
                                {prato.nome} (R$ {prato.preco})
                                {prato.participa_sorteio && <i className="bi bi-star-fill text-warning ms-1" title="Participa sorteio"></i>}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row justify-content-end mt-3 gap-2">
              <button type="submit" className="btn btn-primary w-100 w-sm-auto" disabled={disabled}>
                {initialVenda?.id ? 'Atualizar Venda' : 'Adicionar Venda'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendaForm;