import { createContext } from 'react';
import type { CreateProductData, Product, SortField, SortOrder, UpdateProductData } from '../types/product.interface';
interface ProductsContextProps {
  products: Product[];
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;


  searchTerm: string;
  sortField: SortField;
  sortOrder: SortOrder;
  handleSort: (field: SortField) => void;
  setSearchTerm: (term: string) => void;

  createProduct: (productData: CreateProductData) => Promise<Product>;
  updateProduct: (id: string, productData: UpdateProductData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  refetchProducts: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const ProductsContext = createContext({} as ProductsContextProps);