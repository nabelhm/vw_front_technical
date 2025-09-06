import { type PropsWithChildren } from "react";
import { useFilters } from "../hooks/useFilters";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product.interface";
import { ProductsContext } from "./ProductsContext";
// Mock data
const productsMock: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 79.99,
    stock: 25,
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    status: "active",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    stock: 50,
    description:
      "Comfortable and sustainable organic cotton t-shirt available in multiple colors. Made with eco-friendly materials.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    status: "active",
    createdAt: "2024-01-14T09:30:00.000Z",
    updatedAt: "2024-01-14T09:30:00.000Z",
  },
  {
    id: "3",
    name: "Smart Home Security Camera",
    category: "Electronics",
    price: 149.99,
    stock: 8,
    description:
      "1080p HD security camera with night vision, motion detection, and mobile app integration. Easy installation and setup.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400",
    status: "active",
    createdAt: "2024-01-13T14:20:00.000Z",
    updatedAt: "2024-01-13T14:20:00.000Z",
  },
];
export const ProductsProvider = ({ children }: PropsWithChildren) => {
  const {
    products,
    handleAddProduct,
    handleEdit,
    handleView,
    handleDelete
  } = useProducts(productsMock);

  const { 
    filteredProducts, 
    searchTerm, 
    setSearchTerm 
  } = useFilters(products);

  return (
    <ProductsContext.Provider
      value={{
        products: filteredProducts,
        searchTerm,
        setSearchTerm,
        handleAddProduct,
        handleEdit,
        handleView,
        handleDelete
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}