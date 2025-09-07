import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductAction } from '../../src/actions/create-product-action';
import { productApi } from '../../src/api/product.api';
import type { CreateProductData } from '../../src/types/product.interface';

vi.mock('../../src/api/product.api');

describe('createProductAction - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a product with valid data', async () => {
    const productData: CreateProductData = {
      name: 'Gaming Headset',
      category: 'Electronics',
      price: 129.99,
      stock: 25,
      description: 'High-quality gaming headset with surround sound',
      image: 'https://example.com/headset.jpg',
      status: 'active'
    };

    const expectedApiResponse = {
      id: 'api_generated_id',
      name: 'Gaming Headset',
      category: 'Electronics',
      price: 129.99,
      stock: 25,
      description: 'High-quality gaming headset with surround sound',
      image: 'https://example.com/headset.jpg',
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    vi.mocked(productApi.post).mockResolvedValue({ data: expectedApiResponse });

    const result = await createProductAction(productData);

    expect(productApi.post).toHaveBeenCalledTimes(1);
    expect(productApi.post).toHaveBeenCalledWith('/', expect.objectContaining({
      name: 'Gaming Headset',
      category: 'Electronics',
      price: 129.99,
      stock: 25,
      description: 'High-quality gaming headset with surround sound',
      image: 'https://example.com/headset.jpg',
      status: 'active'
    }));
    
    expect(result).toEqual(expectedApiResponse);
  });
});