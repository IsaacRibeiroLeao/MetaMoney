export interface Product {
  id?: number;
  name: string;
  price: number;
  locked?: boolean;
  timestamp?: string;
}

export interface Venda {
  id?: number;
  name: string;
  price: number;
  locked?: boolean;
  timestamp?: string;
}

export interface Categoria {
  id?: number;
  nome: string;
  ordem?: number;
}

export interface Prato {
  id?: number;
  nome: string;
  preco: number;
  categoria_id: number;
  participa_sorteio: boolean;
  descricao?: string;
}

export interface Categoria {
  id?: number;
  nome: string;
  ordem?: number;
}

export interface Prato {
  id?: number;
  nome: string;
  preco: number;
  categoria_id: number;
  participa_sorteio: boolean;
  descricao?: string;
}
