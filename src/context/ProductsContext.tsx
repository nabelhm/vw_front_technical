import { createContext } from 'react';
import type { Product, SortField, SortOrder } from '../types/product.interface';
import type { CreateProductData, UpdateProductData } from '../mappers/product.mapper';

interface ProductsContextProps {
  // Lista de productos
  products: Product[];
  isLoading: boolean; // Para operaciones CRUD
  isInitialLoading: boolean; // Para carga inicial
  error: string | null;
  
  // Filtros y ordenamiento
  searchTerm: string;
  sortField: SortField;
  sortOrder: SortOrder;
  handleSort: (field: SortField) => void;
  setSearchTerm: (term: string) => void;
  
  // Acciones CRUD (sin navegación)
  createProduct: (productData: CreateProductData) => Promise<Product>;
  updateProduct: (id: string, productData: UpdateProductData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Utilidades
  refetchProducts: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const ProductsContext = createContext({} as ProductsContextProps);