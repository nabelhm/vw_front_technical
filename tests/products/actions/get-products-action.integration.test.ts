import { describe, expect, test } from 'vitest';
import { getProductsAction } from '../../../src/products/actions/get-products-action';

describe('getProductsAction Integration', () => {
  test('should fetch real products from JSON Server', async () => {
    const products = await getProductsAction();
    
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('should return products with correct structure', async () => {
    const products = await getProductsAction();
    
    if (products.length > 0) {
      const firstProduct = products[0];
      
      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('category');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('stock');
      expect(firstProduct).toHaveProperty('description');
      expect(firstProduct).toHaveProperty('image');
      expect(firstProduct).toHaveProperty('status');
      expect(firstProduct).toHaveProperty('createdAt');
      expect(firstProduct).toHaveProperty('updatedAt');
      
      expect(typeof firstProduct.id).toBe('string');
      expect(typeof firstProduct.name).toBe('string');
      expect(typeof firstProduct.category).toBe('string');
      expect(typeof firstProduct.price).toBe('number');
      expect(typeof firstProduct.stock).toBe('number');
      expect(typeof firstProduct.status).toBe('string');
    }
  });

  test('should handle API connection properly', async () => {
    await expect(getProductsAction()).resolves.not.toThrow();
  });

  test('should return consistent data on multiple calls', async () => {
    const firstCall = await getProductsAction();
    const secondCall = await getProductsAction();
    
    expect(firstCall.length).toBe(secondCall.length);
    
    if (firstCall.length > 0) {
      expect(firstCall[0].id).toBe(secondCall[0].id);
      expect(firstCall[0].name).toBe(secondCall[0].name);
    }
  });
});