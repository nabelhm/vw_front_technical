import { describe, expect, it } from 'vitest';
import { updateProductAction } from '../../src/actions/update-product-action';
import { createProductAction } from '../../src/actions/create-product-action';
import { CreateProductData, UpdateProductData } from '../../src/types/product.interface';

describe('updateProductAction - Real Integration Tests', () => {

  it('should update a product with real API call', async () => {
    const createData: CreateProductData = {
      name: `Original Product ${Date.now()}`,
      category: 'Electronics',
      price: 99.99,
      stock: 20,
      description: 'Original description',
      image: 'https://example.com/original.jpg',
      status: 'active'
    };

    const createdProduct = await createProductAction(createData);

    const updateData: UpdateProductData = {
      name: `Updated Product ${Date.now()}`,
      category: 'Kitchen', 
      price: 149.99,
      stock: 35,
      description: 'Updated description for integration test',
      image: 'https://example.com/updated.jpg',
      status: 'active'
    };

    const result = await updateProductAction(createdProduct.id, updateData);

    expect(result).toBeDefined();
    expect(result.id).toBe(createdProduct.id); // Same ID
    expect(result.name).toBe(updateData.name);
    expect(result.category).toBe(updateData.category);
    expect(result.price).toBe(updateData.price);
    expect(result.stock).toBe(updateData.stock);
    expect(result.description).toBe(updateData.description);
    expect(result.image).toBe(updateData.image);
    expect(result.status).toBe(updateData.status);

    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(new Date(result.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(result.createdAt).getTime()
    );
  }, 15000);

  it('should handle updating non-existent product', async () => {
    const nonExistentId = 'non_existent_product_123';
    const updateData: UpdateProductData = {
      name: 'Updated Product',
      category: 'Electronics',
      price: 99.99,
      stock: 10,
      description: 'Test description',
      image: 'https://example.com/test.jpg',
      status: 'active'
    };

    await expect(updateProductAction(nonExistentId, updateData))
      .rejects
      .toThrow();
  }, 10000);

  it('should handle validation errors in update', async () => {
    const createData: CreateProductData = {
      name: `Valid Product ${Date.now()}`,
      category: 'Electronics',
      price: 99.99,
      stock: 20,
      description: 'Valid description',
      image: 'https://example.com/valid.jpg',
      status: 'active'
    };

    const createdProduct = await createProductAction(createData);

    const invalidUpdateData: UpdateProductData = {
      name: 'Updated Product',
      category: 'InvalidCategory',
      price: 99.99,
      stock: 10,
      description: 'Test description',
      image: 'https://example.com/test.jpg',
      status: 'active'
    };

    await expect(updateProductAction(createdProduct.id, invalidUpdateData))
      .rejects
      .toThrow(/Invalid category/);
  }, 15000);

  it('should update product status from active to inactive', async () => {
    const createData: CreateProductData = {
      name: `Status Test Product ${Date.now()}`,
      category: 'Electronics',
      price: 79.99,
      stock: 15,
      description: 'Product for status test',
      image: 'https://example.com/status-test.jpg',
      status: 'active'
    };

    const createdProduct = await createProductAction(createData);

    const updateData: UpdateProductData = {
      ...createData,
      status: 'inactive' 
    };

    const result = await updateProductAction(createdProduct.id, updateData);

    expect(result.status).toBe('inactive');
    expect(result.id).toBe(createdProduct.id);
  }, 15000);
});