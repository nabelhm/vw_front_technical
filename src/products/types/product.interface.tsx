export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export type Category = 'Kitchen' | 'Electronics' | 'Garden' | 'Construction' | 'Sports' | 'Clothing';

export type Status = 'active' | 'inactive';

export type SortField = 'name' | 'category' | 'price' | 'stock' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface CreateProductData {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  status: string;
}

export interface UpdateProductData {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  status: string;
}
