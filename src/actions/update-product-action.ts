import { productApi } from "../api/product.api";
import {
  mapUpdateProductDataToProduct,
} from "../mappers/product.mapper";
import type { Product, UpdateProductData } from "../types/product.interface";
import { getProductByIdAction } from "./get-product-by-id-action";

export const updateProductAction = async (
  id: string,
  productData: UpdateProductData
): Promise<Product> => {
  const currentProduct = await getProductByIdAction(id);
  
  const mappedProduct = mapUpdateProductDataToProduct(
    productData, 
    id, 
    currentProduct.createdAt
  );

  const { data } = await productApi.put<Product>(`/${id}`, mappedProduct);

  return data;
};