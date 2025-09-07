import { productApi } from "../api/product.api";
import type { Product } from "../types/product.interface";

export const getProductByIdAction = async (id: string): Promise<Product> => {
  const { data } = await productApi.get<Product>(`/${id}`);
  
  return data;
};