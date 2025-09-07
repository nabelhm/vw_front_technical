import { describe, expect, it } from 'vitest';
import { createProductAction } from '../../src/actions/create-product-action';
import { deleteProductAction } from '../../src/actions/delete-product-action';
import { getProductByIdAction } from '../../src/actions/get-product-by-id-action';
import { CreateProductData } from '../../src/types/product.interface';

describe('deleteProductAction - Real Integration Tests', () => {

  it('should delete a product with real API call', async () => {
    const createData: CreateProductData = {
      name: `Product to Delete ${Date.now()}`,
      category: 'Electronics',
      price: 99.99,
      stock: 20,
      description: 'This product will be deleted in test',
      image: 'https://example.com/to-delete.jpg',
      status: 'active'
    };

    const createdProduct = await createProductAction(createData);

    const productBeforeDelete = await getProductByIdAction(createdProduct.id);
    expect(productBeforeDelete).toBeDefined();
    expect(productBeforeDelete.id).toBe(createdProduct.id);

    await deleteProductAction(createdProduct.id);

    await expect(getProductByIdAction(createdProduct.id))
      .rejects
      .toThrow(); 
  }, 15000);

  it('should handle deleting non-existent product', async () => {
    const nonExistentId = 'non_existent_product_to_delete_123';

    await expect(deleteProductAction(nonExistentId))
      .rejects
      .toThrow();
  }, 10000);
});