import { describe, expect, it } from 'vitest';
import { createProductAction } from '../../src/actions/create-product-action';
import { CreateProductData } from '../../src/types/product.interface';

describe('createProductAction - Real Integration Tests', () => {

  it('should create a product with real API call', async () => {
    const createData: CreateProductData = {
      name: `Gaming Headset ${Date.now()}`,
      category: 'Electronics',
      price: 129.99,
      stock: 25,
      description: 'High-quality gaming headset with surround sound',
      image: 'https://example.com/headset.jpg',
      status: 'active'
    };

    const result = await createProductAction(createData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(createData.name);
    expect(result.category).toBe(createData.category);
    expect(result.price).toBe(createData.price);
    expect(result.stock).toBe(createData.stock);
    expect(result.description).toBe(createData.description);
    expect(result.image).toBe(createData.image);
    expect(result.status).toBe(createData.status);

    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(new Date(result.createdAt)).toBeInstanceOf(Date);
    expect(new Date(result.updatedAt)).toBeInstanceOf(Date);
  }, 15000);

  it('should handle validation errors for invalid category', async () => {
    const invalidCreateData: CreateProductData = {
      name: `Invalid Product ${Date.now()}`,
      category: 'InvalidCategory',
      price: 99.99,
      stock: 10,
      description: 'Test description',
      image: 'https://example.com/test.jpg',
      status: 'active'
    };

    await expect(createProductAction(invalidCreateData))
      .rejects
      .toThrow(/Invalid category/);
  }, 10000);

  it('should create product with inactive status', async () => {
    const createData: CreateProductData = {
      name: `Inactive Product ${Date.now()}`,
      category: 'Kitchen',
      price: 59.99,
      stock: 8,
      description: 'Product created with inactive status',
      image: 'https://example.com/inactive.jpg',
      status: 'inactive'
    };

    const result = await createProductAction(createData);

    expect(result).toBeDefined();
    expect(result.status).toBe('inactive');
    expect(result.name).toBe(createData.name);
    expect(result.category).toBe(createData.category);
  }, 15000);
});