import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  initialProduct?: Product;
  disabled?: boolean;
}

const defaultProduct: Product = {
  name: '',
  price: 0
};

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialProduct, disabled = false }) => {
  const [product, setProduct] = useState<Product>(initialProduct || defaultProduct);
  const [errors, setErrors] = useState<{name?: string, price?: string}>({});

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const validate = (): boolean => {
    const newErrors: {name?: string, price?: string} = {};
    
    if (!product.name.trim()) {
      newErrors.name = 'Nome da pessoa e obrigatorio';
    }
    
    if (product.price <= 0) {
      newErrors.price = 'Preço deve ser maior que 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(product);
      
      // Reset form if it's not an edit
      if (!initialProduct) {
        setProduct(defaultProduct);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="productName" className="form-label">Identificação</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="productName"
                name="name"
                value={product.name}
                onChange={handleChange}
                disabled={disabled}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="productPrice" className="form-label">Valor</label>
              <input
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="productPrice"
                name="price"
                step="0.01"
                min="0"
                value={product.price}
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
              {initialProduct?.id ? 'Atualizar Produto' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
