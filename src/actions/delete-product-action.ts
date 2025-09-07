import { productApi } from "../api/product.api";

export const deleteProductAction = async (id: string): Promise<void> => {
  await productApi.delete(`/${id}`);
};