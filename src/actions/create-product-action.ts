import { productApi } from "../api/product.api";
import {
  generateTempId,
  mapCreateProductDataToProduct,
} from "../mappers/product.mapper";
import type { CreateProductData, Product, } from "../types/product.interface";

export const createProductAction = async (
  productData: CreateProductData
): Promise<Product> => {
  const tempId = generateTempId();
  const mappedProduct = mapCreateProductDataToProduct(productData, tempId);

  const { data } = await productApi.post<Product>("/", mappedProduct);

  return data;
};
