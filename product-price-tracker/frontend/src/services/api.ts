import axios from 'axios';
import { Product, Venda } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

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
