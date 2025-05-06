import axios from 'axios';
import { Product, Venda, Categoria, Prato } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Final value type definition
export interface FinalValue {
  is_locked: boolean;
  total_sum: number;
  timestamp: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const addProduct = async (product: Product): Promise<Product> => {
  const response = await axios.post(`${API_URL}/products`, product);
  return response.data;
};

// API para Categorias
export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await axios.get(`${API_URL}/categorias`);
  return response.data;
};

export const addCategoria = async (categoria: Categoria): Promise<Categoria> => {
  const response = await axios.post(`${API_URL}/categorias`, categoria);
  return response.data;
};

export const updateCategoria = async (categoria: Categoria): Promise<Categoria> => {
  if (!categoria.id) throw new Error('Categoria ID is required for update');
  const response = await axios.put(`${API_URL}/categorias/${categoria.id}`, categoria);
  return response.data;
};

export const deleteCategoria = async (id: number): Promise<{ deleted: boolean }> => {
  const response = await axios.delete(`${API_URL}/categorias/${id}`);
  return response.data;
};

// API para Pratos
export const getPratos = async (): Promise<Prato[]> => {
  const response = await axios.get(`${API_URL}/pratos`);
  return response.data;
};

export const getPratosByCategoria = async (categoriaId: number): Promise<Prato[]> => {
  const response = await axios.get(`${API_URL}/categorias/${categoriaId}/pratos`);
  return response.data;
};

export const addPrato = async (prato: Prato): Promise<Prato> => {
  const response = await axios.post(`${API_URL}/pratos`, prato);
  return response.data;
};

export const updatePrato = async (prato: Prato): Promise<Prato> => {
  if (!prato.id) throw new Error('Prato ID is required for update');
  const response = await axios.put(`${API_URL}/pratos/${prato.id}`, prato);
  return response.data;
};

export const deletePrato = async (id: number): Promise<{ deleted: boolean }> => {
  const response = await axios.delete(`${API_URL}/pratos/${id}`);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<{ deleted: boolean }> => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};

export const deleteVenda = async (id: number): Promise<{ deleted: boolean }> => {
  const response = await axios.delete(`${API_URL}/vendas/${id}`);
  return response.data;
};

export const clearAll = async (): Promise<{ cleared: boolean }> => {
  const response = await axios.delete(`${API_URL}/clear-all`);
  return response.data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  if (!product.id) throw new Error('Product ID is required for update');
  const response = await axios.put(`${API_URL}/products/${product.id}`, product);
  return response.data;
};

export const getFinalValue = async (): Promise<FinalValue> => {
  const response = await axios.get(`${API_URL}/final-value`);
  return response.data;
};

export const lockFinalValue = async (): Promise<FinalValue> => {
  const response = await axios.put(`${API_URL}/final-value/lock`);
  return response.data;
};

// Vendas API services
export const getVendas = async (): Promise<Venda[]> => {
  const response = await axios.get(`${API_URL}/vendas`);
  return response.data;
};

export const addVenda = async (venda: Venda): Promise<Venda> => {
  const response = await axios.post(`${API_URL}/vendas`, venda);
  return response.data;
};

export const updateVenda = async (venda: Venda): Promise<Venda> => {
  if (!venda.id) throw new Error('Venda ID is required for update');
  const response = await axios.put(`${API_URL}/vendas/${venda.id}`, venda);
  return response.data;
};

export const getVendasFinalValue = async (): Promise<FinalValue> => {
  const response = await axios.get(`${API_URL}/vendas-final-value`);
  return response.data;
};

export const lockVendasFinalValue = async (): Promise<FinalValue> => {
  const response = await axios.put(`${API_URL}/vendas-final-value/lock`);
  return response.data;
};

// Random name selection for raffle
export interface RandomNameResponse {
  selected_name: string;
}

export function selectRandomName(names: string[]): Promise<RandomNameResponse> {
  return axios.post(`${API_URL}/random-name`, { names })
    .then(response => response.data);
}
