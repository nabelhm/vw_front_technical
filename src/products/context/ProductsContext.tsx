import { createContext } from 'react'
import type { Product } from '../types/product.interface';

interface Props {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleAddProduct: () => void;
  handleEdit: (id: string) => void;
  handleView: (id: string) => void;
  handleDelete: (id: string) => void;
}

export const ProductsContext = createContext({} as Props);
