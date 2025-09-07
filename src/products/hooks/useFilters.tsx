import { useState, useMemo } from "react";
import type { Product } from "../types/product.interface";

export const useFilters = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProducts = useMemo(() => {
    if (searchTerm === "") {
      return products;
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerTerm) ||
        product.category.toLowerCase().includes(lowerTerm) ||
        product.description.toLowerCase().includes(lowerTerm)
    );
  }, [products, searchTerm]);

  return {
    filteredProducts,
    searchTerm,
    setSearchTerm
  };
};