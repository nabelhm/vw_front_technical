import { useCallback, useEffect, useState } from "react";
import { createProductAction } from "../actions/create-product-action";
import { deleteProductAction } from "../actions/delete-product-action";
import { getProductsAction } from "../actions/get-products-action";
import { updateProductAction } from "../actions/update-product-action";
import type { CreateProductData, Product, UpdateProductData } from "../types/product.interface";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);

    try {
      const fetchedProducts = await getProductsAction();
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading products';
      setError(errorMessage);
      console.error('Failed to fetch products:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const createProduct = useCallback(async (productData: CreateProductData): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const newProduct = await createProductAction(productData);

      setProducts(prev => [...prev, newProduct]);

      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating product';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: UpdateProductData): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProduct = await updateProductAction(id, productData);

      setProducts(prev =>
        prev.map(product =>
          product.id === id ? updatedProduct : product
        )
      );

      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating product';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteProductAction(id);

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting product';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    isInitialLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts,
    setError
  };
};