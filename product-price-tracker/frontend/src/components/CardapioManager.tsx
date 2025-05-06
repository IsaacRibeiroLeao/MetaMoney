import React, { useState, useEffect } from 'react';
import { Categoria, Prato } from '../types';
import { 
  getCategorias, 
  getPratos, 
  addCategoria, 
  updateCategoria, 
  deleteCategoria,
  addPrato,
  updatePrato,
  deletePrato
} from '../services/api';
import CategoriaForm from './CategoriaForm';
import PratoForm from './PratoForm';
import { toast } from 'react-toastify';

const CardapioManager: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'categorias' | 'pratos'>('categorias');
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [editingPrato, setEditingPrato] = useState<Prato | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriasData, pratosData] = await Promise.all([
        getCategorias(),
        getPratos()
      ]);
      
      // Ordenar categorias por ordem
      const sortedCategorias = categoriasData.sort((a, b) => 
        (a.ordem || 0) - (b.ordem || 0)
      );
      
      setCategorias(sortedCategorias);
      setPratos(pratosData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados do cardápio:', error);
      toast.error('Erro ao carregar dados do cardápio');
      setLoading(false);
    }
  };

  const handleAddCategoria = async (categoria: Categoria) => {
    try {
      const newCategoria = await addCategoria(categoria);
      setCategorias(prev => [...prev, newCategoria].sort((a, b) => 
        (a.ordem || 0) - (b.ordem || 0)
      ));
      toast.success('Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const handleUpdateCategoria = async (categoria: Categoria) => {
    try {
      const updatedCategoria = await updateCategoria(categoria);
      setCategorias(prev => 
        prev.map(c => c.id === categoria.id ? updatedCategoria : c)
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
      );
      setEditingCategoria(null);
      toast.success('Categoria atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error('Erro ao atualizar categoria');
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    // Verificar se existem pratos nesta categoria
    const pratosNaCategoria = pratos.filter(p => p.categoria_id === id);
    if (pratosNaCategoria.length > 0) {
      toast.error('Não é possível excluir uma categoria que contém pratos');
      return;
    }

    try {
      await deleteCategoria(id);
      setCategorias(prev => prev.filter(c => c.id !== id));
      toast.success('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
    }
  };

  const handleAddPrato = async (prato: Prato) => {
    try {
      const newPrato = await addPrato(prato);
      setPratos(prev => [...prev, newPrato]);
      toast.success('Prato adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar prato:', error);
      toast.error('Erro ao adicionar prato');
    }
  };

  const handleUpdatePrato = async (prato: Prato) => {
    try {
      const updatedPrato = await updatePrato(prato);
      setPratos(prev => 
        prev.map(p => p.id === prato.id ? updatedPrato : p)
      );
      setEditingPrato(null);
      toast.success('Prato atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar prato:', error);
      toast.error('Erro ao atualizar prato');
    }
  };

  const handleDeletePrato = async (id: number) => {
    try {
      await deletePrato(id);
      setPratos(prev => prev.filter(p => p.id !== id));
      toast.success('Prato excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir prato:', error);
      toast.error('Erro ao excluir prato');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-md-start">Gerenciamento de Cardápio</h2>
      
      <ul className="nav nav-tabs mb-4 justify-content-center justify-content-md-start">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            <i className="bi bi-list-ul me-1 d-none d-sm-inline"></i>
            Categorias
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'pratos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pratos')}
          >
            <i className="bi bi-cup-hot me-1 d-none d-sm-inline"></i>
            Pratos
          </button>
        </li>
      </ul>
      
      {activeTab === 'categorias' && (
        <div>
          <div className="row flex-column-reverse flex-md-row">
            <div className="col-md-6 mb-4 mb-md-0">
              <CategoriaForm 
                onSubmit={editingCategoria ? handleUpdateCategoria : handleAddCategoria}
                initialCategoria={editingCategoria || undefined}
              />
              {editingCategoria && (
                <button 
                  className="btn btn-secondary mb-4 w-100 w-md-auto"
                  onClick={() => setEditingCategoria(null)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancelar Edição
                </button>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-list-ul me-2"></i>
                    Categorias Existentes
                  </h5>
                </div>
                <div className="card-body p-0">
                  {categorias.length === 0 ? (
                    <p className="text-muted p-3">Nenhuma categoria cadastrada</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-3">Nome</th>
                            <th>Ordem</th>
                            <th className="text-end pe-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categorias.map(categoria => (
                            <tr key={categoria.id}>
                              <td className="ps-3">{categoria.nome}</td>
                              <td>{categoria.ordem}</td>
                              <td className="text-end pe-3">
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => setEditingCategoria(categoria)}
                                    title="Editar"
                                  >
                                    <i className="bi bi-pencil"></i>
                                    <span className="d-none d-md-inline ms-1">Editar</span>
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => {
                                      if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
                                        handleDeleteCategoria(categoria.id!);
                                      }
                                    }}
                                    title="Excluir"
                                  >
                                    <i className="bi bi-trash"></i>
                                    <span className="d-none d-md-inline ms-1">Excluir</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'pratos' && (
        <div>
          <div className="row flex-column-reverse flex-md-row">
            <div className="col-md-6 mb-4 mb-md-0">
              <PratoForm 
                onSubmit={editingPrato ? handleUpdatePrato : handleAddPrato}
                initialPrato={editingPrato || undefined}
              />
              {editingPrato && (
                <button 
                  className="btn btn-secondary mb-4 w-100 w-md-auto"
                  onClick={() => setEditingPrato(null)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancelar Edição
                </button>
              )}
            </div>
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-cup-hot me-2"></i>
                    Pratos Existentes
                  </h5>
                </div>
                <div className="card-body p-0">
                  {pratos.length === 0 ? (
                    <p className="text-muted p-3">Nenhum prato cadastrado</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-3">Nome</th>
                            <th>Preço</th>
                            <th className="d-none d-md-table-cell">Categoria</th>
                            <th className="d-none d-sm-table-cell">Sorteio</th>
                            <th className="text-end pe-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pratos.map(prato => {
                            const categoria = categorias.find(c => c.id === prato.categoria_id);
                            return (
                              <tr key={prato.id}>
                                <td className="ps-3">
                                  <div className="d-flex flex-column">
                                    <span>{prato.nome}</span>
                                    <small className="text-muted d-sm-none">
                                      {prato.participa_sorteio ? 
                                        <span className="badge bg-warning me-1">Sorteio</span> : null}
                                      <span className="d-md-none">{categoria?.nome || 'N/A'}</span>
                                    </small>
                                  </div>
                                </td>
                                <td>R$ {prato.preco.toFixed(2)}</td>
                                <td className="d-none d-md-table-cell">{categoria?.nome || 'N/A'}</td>
                                <td className="d-none d-sm-table-cell">
                                  {prato.participa_sorteio ? (
                                    <span className="badge bg-warning">Sim</span>
                                  ) : (
                                    <span className="badge bg-secondary">Não</span>
                                  )}
                                </td>
                                <td className="text-end pe-3">
                                  <div className="btn-group btn-group-sm">
                                    <button 
                                      className="btn btn-outline-primary"
                                      onClick={() => setEditingPrato(prato)}
                                      title="Editar"
                                    >
                                      <i className="bi bi-pencil"></i>
                                      <span className="d-none d-md-inline ms-1">Editar</span>
                                    </button>
                                    <button 
                                      className="btn btn-outline-danger"
                                      onClick={() => {
                                        if (window.confirm(`Tem certeza que deseja excluir o prato "${prato.nome}"?`)) {
                                          handleDeletePrato(prato.id!);
                                        }
                                      }}
                                      title="Excluir"
                                    >
                                      <i className="bi bi-trash"></i>
                                      <span className="d-none d-md-inline ms-1">Excluir</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardapioManager;
