import axios from 'axios';
import { Product, Venda } from '../types';

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

// Static menu options (Pratos e Bebidas)
export const STATIC_PRODUCTS: Product[] = [
  { name: 'Tradicional (300ml)', price: 15 },
  { name: 'Porção de Paçoca', price: 10 },
  { name: 'Copo de Creme de Galinha', price: 12 },
  { name: 'Arrumadinho', price: 20 },
  { name: 'Suco', price: 5 },
  { name: 'Refrigerante', price: 5 },
];

export function getStaticProducts(): Product[] {
  return STATIC_PRODUCTS;
}

// Static combo options
export const COMBO_PRODUCTS: Product[] = [
  { name: 'Combo dos Apóstolos', price: 115 }, // 5 arrumadinho + 5 bebidas
  { name: 'Combo Casal Ungido', price: 46 },    // 2 arrumadinhos + 2 bebidas
  { name: 'Combo Misericórdia', price: 37 },    // 1 arrumadinho + 1 açaí + 1 bebida
  { name: 'Combo Não vou pro Iphm', price: 23 },// 1 arrumadinho + 1 bebida
  { name: 'Combo Casal Fit', price: 28 },       // 2 copos de açaí
];

export function getComboProducts(): Product[] {
  return COMBO_PRODUCTS;
}

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
