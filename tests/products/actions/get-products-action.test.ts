import { beforeEach, describe, expect, test, vi } from 'vitest';
import { getProductsAction } from '../../../src/products/actions/get-products-action';
import { productApi } from '../../../src/products/api/product.api';
import type { Product } from '../../../src/products/types/product.interface';

vi.mock('../../../src/products/api/product.api', () => ({
  productApi: {
    get: vi.fn()
  }
}));

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Test Product 1",
    category: "Electronics",
    price: 99.99,
    stock: 10,
    description: "Test description 1",
    image: "test1.jpg",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Test Product 2",
    category: "Clothing",
    price: 49.99,
    stock: 25,
    description: "Test description 2",
    image: "test2.jpg",
    status: "inactive",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  }
];

describe('getProductsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch products successfully', async () => {
    const mockResponse = { data: mockProducts };
    vi.mocked(productApi.get).mockResolvedValue(mockResponse);

    const result = await getProductsAction();

    expect(productApi.get).toHaveBeenCalledWith('/');
    expect(result).toEqual(mockProducts);
    expect(result).toHaveLength(2);
  });

  test('should return empty array when no products', async () => {
    const mockResponse = { data: [] };
    vi.mocked(productApi.get).mockResolvedValue(mockResponse);

    const result = await getProductsAction();

    expect(productApi.get).toHaveBeenCalledWith('/');
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  test('should return Product array with correct structure', async () => {
    const mockResponse = { data: mockProducts };
    vi.mocked(productApi.get).mockResolvedValue(mockResponse);

    const result = await getProductsAction();

    expect(Array.isArray(result)).toBe(true);
    
    if (result.length > 0) {
      const firstProduct = result[0];
      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('category');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('stock');
      expect(firstProduct).toHaveProperty('status');
    }
  });
});