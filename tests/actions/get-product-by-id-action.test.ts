import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getProductByIdAction } from '../../src/actions/get-product-by-id-action';
import { productApi } from '../../src/api/product.api';
import type { Product } from '../../src/types/product.interface';

vi.mock('../../src/api/product.api', () => ({
  productApi: {
    get: vi.fn()
  }
}));

const mockProduct: Product = {
  id: "test-id-123",
  name: "Test Product",
  category: "Electronics",
  price: 99.99,
  stock: 10,
  description: "Test description",
  image: "test.jpg",
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe('getProductByIdAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch product by id successfully', async () => {
    const productId = 'test-id-123';
    const mockResponse = { data: mockProduct };
    vi.mocked(productApi.get).mockResolvedValue(mockResponse);

    const result = await getProductByIdAction(productId);

    expect(productApi.get).toHaveBeenCalledWith('/test-id-123');
    expect(result).toEqual(mockProduct);
    expect(result.id).toBe(productId);
  });

  test('should call API with correct endpoint and id', async () => {
    const productId = '456';
    const mockResponse = { data: mockProduct };
    vi.mocked(productApi.get).mockResolvedValue(mockResponse);

    await getProductByIdAction(productId);

    expect(productApi.get).toHaveBeenCalledTimes(1);
    expect(productApi.get).toHaveBeenCalledWith('/456');
  });

  test('should throw error when product not found', async () => {
    const productId = 'non-existent-id';
    const error = new Error('Request failed with status code 404');
    vi.mocked(productApi.get).mockRejectedValue(error);

    await expect(getProductByIdAction(productId)).rejects.toThrow('Request failed with status code 404');
    expect(productApi.get).toHaveBeenCalledWith('/non-existent-id');
  });

  test('should throw error when API call fails', async () => {
    const productId = 'test-id';
    const errorMessage = 'Network Error';
    vi.mocked(productApi.get).mockRejectedValue(new Error(errorMessage));

    await expect(getProductByIdAction(productId)).rejects.toThrow(errorMessage);
    expect(productApi.get).toHaveBeenCalledWith('/test-id');
  });

  test('should return product with correct structure', async () => {
    const productId = 'test-id';
    const mockResponse = { data: mockProduct };
    vi.mocked(productApi.get).mockResolvedValue(mockResponse);

    const result = await getProductByIdAction(productId);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('price');
    expect(result).toHaveProperty('stock');
    expect(result).toHaveProperty('status');
    expect(typeof result.id).toBe('string');
    expect(typeof result.name).toBe('string');
    expect(typeof result.price).toBe('number');
  });
});