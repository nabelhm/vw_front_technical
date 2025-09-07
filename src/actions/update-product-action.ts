import { productApi } from "../api/product.api";
import {
  mapUpdateProductDataToProduct,
} from "../mappers/product.mapper";
import type { Product, UpdateProductData } from "../types/product.interface";

export const updateProductAction = async (
  id: string,
  productData: UpdateProductData
): Promise<Product> => {
  const mappedProduct = mapUpdateProductDataToProduct(productData, id);

  const { data } = await productApi.put<Product>(`/${id}`, mappedProduct);

  return data;
};