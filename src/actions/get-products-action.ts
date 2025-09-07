import { productApi } from "../api/product.api";
import type { Product } from "../types/product.interface";

export const getProductsAction = async (): Promise<Product[]> => {
  const { data } = await productApi.get<Product[]>(`/`);

  return data;
};
