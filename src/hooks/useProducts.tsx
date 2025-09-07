import { useState } from "react";
import type { Product } from "../types/product.interface";

export const useProducts = (initialProducts: Product[]) => {
  const [products] = useState<Product[]>(initialProducts);

  const handleAddProduct = () => {
    console.log("Add new product");
    // TODO: Implement
  };

  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
    // TODO: Implement
  };

  const handleView = (id: string) => {
    console.log("View product:", id);
    // TODO: Implement
  };

  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
    // TODO: Implement
  };

  return {
    products,
    handleAddProduct,
    handleEdit,
    handleView,
    handleDelete
  }
}
