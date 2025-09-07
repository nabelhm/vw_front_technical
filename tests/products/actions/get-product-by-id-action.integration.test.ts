import { describe, test, expect } from 'vitest';
import { getProductByIdAction } from '../../../src/products/actions/get-product-by-id-action';

describe('getProductByIdAction Integration', () => {
  test('should fetch real product by id from JSON Server', async () => {
    const product = await getProductByIdAction('1');
    
    expect(product).toBeDefined();
    expect(product.id).toBe('1');
    expect(typeof product.name).toBe('string');
    expect(typeof product.price).toBe('number');
  });

  test('should throw error for non-existent product id', async () => {
    await expect(getProductByIdAction('999999')).rejects.toThrow();
  });

  test('should return product with all required properties', async () => {
    const product = await getProductByIdAction('1');
    
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('stock');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('image');
    expect(product).toHaveProperty('status');
    expect(product).toHaveProperty('createdAt');
    expect(product).toHaveProperty('updatedAt');
  });
});