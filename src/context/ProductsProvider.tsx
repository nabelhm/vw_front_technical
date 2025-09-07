import { type PropsWithChildren } from "react";
import { useFilters } from "../hooks/useFilters";
import { useProducts } from "../hooks/useProducts";
import { ProductsContext } from "./ProductsContext";
import { useSort } from "../hooks/useSort";

export const ProductsProvider = ({ children }: PropsWithChildren) => {
  const {
    products,
    isLoading,
    isInitialLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts,
    setError
  } = useProducts();

  const { 
    filteredProducts, 
    searchTerm, 
    setSearchTerm 
  } = useFilters(products);

  const { sortedProducts, sortField, sortOrder, handleSort } = useSort(filteredProducts);

  return (
    <ProductsContext.Provider
      value={{
        // Lista de productos
        products: sortedProducts,
        isLoading,
        isInitialLoading,
        error,
        
        // Filtros y ordenamiento
        searchTerm,
        sortField,
        sortOrder,
        handleSort,
        setSearchTerm,
        
        // Acciones CRUD (sin navegación)
        createProduct,
        updateProduct,
        deleteProduct,
        
        // Utilidades
        refetchProducts,
        setError
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};