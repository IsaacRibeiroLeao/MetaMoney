import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  initialProduct?: Product;
  disabled?: boolean;
}

const defaultProduct: Product = {
  name: '',
  price: '' as unknown as number
};

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialProduct, disabled = false }) => {
  const [product, setProduct] = useState<Product>(initialProduct || defaultProduct);
  const [identificacao, setIdentificacao] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [errors, setErrors] = useState<{ identificacao?: string; item?: string; price?: string }>({});

  useEffect(() => {
    if (initialProduct) {
      // separa identificação e item se houver "-"
      const [idPart, itemPart] = initialProduct.name.split(" - ");
      setIdentificacao(idPart || '');
      setItem(itemPart || '');
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const validate = (): boolean => {
    const newErrors: { identificacao?: string; item?: string; price?: string } = {};

    if (!identificacao.trim()) newErrors.identificacao = 'Identificação é obrigatória';
    if (!item.trim()) newErrors.item = 'Item é obrigatório';

    const numericPrice = typeof product.price === 'string' ? parseFloat(product.price as string) || 0 : product.price;
    if (numericPrice <= 0) newErrors.price = 'Valor deve ser maior que 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submittedProduct = {
      ...product,
      name: `${identificacao.trim()} - ${item.trim()}`,
      price: typeof product.price === 'string' ? parseFloat(product.price as string) || 0 : product.price
    };

    onSubmit(submittedProduct);

    if (!initialProduct) {
      setIdentificacao('');
      setItem('');
      setProduct(defaultProduct);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-4 mb-3 mb-md-0">
              <label htmlFor="identificacao" className="form-label">Identificação</label>
              <input
                type="text"
                className={`form-control ${errors.identificacao ? 'is-invalid' : ''}`}
                id="identificacao"
                value={identificacao}
                onChange={(e) => setIdentificacao(e.target.value)}
                disabled={disabled}
              />
              {errors.identificacao && <div className="invalid-feedback">{errors.identificacao}</div>}
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <label htmlFor="item" className="form-label">Item</label>
              <input
                type="text"
                className={`form-control ${errors.item ? 'is-invalid' : ''}`}
                id="item"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                disabled={disabled}
              />
              {errors.item && <div className="invalid-feedback">{errors.item}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="productPrice" className="form-label">Valor</label>
              <input
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="productPrice"
                step="0.01"
                min="0"
                value={product.price}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      price: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0
                    }))
                  }
                disabled={disabled}
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={disabled}>
              {initialProduct?.id ? 'Atualizar Produto' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
