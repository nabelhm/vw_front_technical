import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useProducts } from '../../src/hooks/useProducts';
import { Product, CreateProductData, UpdateProductData } from '../../src/types/product.interface';

vi.mock('../../src/actions/get-products-action');
vi.mock('../../src/actions/create-product-action');
vi.mock('../../src/actions/update-product-action');
vi.mock('../../src/actions/delete-product-action');

import { getProductsAction } from '../../src/actions/get-products-action';
import { createProductAction } from '../../src/actions/create-product-action';
import { updateProductAction } from '../../src/actions/update-product-action';
import { deleteProductAction } from '../../src/actions/delete-product-action';

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Test Product 1",
    category: "Electronics",
    price: 99.99,
    stock: 10,
    description: "Test description",
    image: "test1.jpg",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2", 
    name: "Test Product 2",
    category: "Clothing",
    price: 29.99,
    stock: 5,
    description: "Test description 2",
    image: "test2.jpg",
    status: "inactive",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  }
];

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getProductsAction).mockResolvedValue(mockProducts);
  });

  test('should initialize with loading state', () => {
    const { result } = renderHook(() => useProducts());
    
    expect(result.current.products).toEqual([]);
    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('should fetch products on mount', async () => {
    const { result } = renderHook(() => useProducts());
    
    await waitFor(() => {
      expect(getProductsAction).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
      expect(result.current.products).toEqual(mockProducts);
    });
  });

  test('should handle initial fetch error', async () => {
    const errorMessage = 'Failed to fetch products';
    vi.mocked(getProductsAction).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.products).toEqual([]);
    });
  });

  test('should create product successfully', async () => {
    const newProductData: CreateProductData = {
      name: 'New Product',
      category: 'Electronics',
      price: 199.99,
      stock: 15,
      description: 'New description',
      image: 'new.jpg',
      status: 'active'
    };

    const createdProduct: Product = {
      id: '3',
      ...newProductData,
      category: 'Electronics',
      status: 'active',
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z'
    };

    vi.mocked(createProductAction).mockResolvedValue(createdProduct);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    let createdResult: Product;
    await act(async () => {
      createdResult = await result.current.createProduct(newProductData);
    });

    expect(createProductAction).toHaveBeenCalledWith(newProductData);
    expect(createdResult!).toEqual(createdProduct);
    expect(result.current.products).toContain(createdProduct);
    expect(result.current.products.length).toBe(3);
  });

  test('should update product successfully', async () => {
    const updateData: UpdateProductData = {
      name: 'Updated Product',
      category: 'Electronics',
      price: 149.99,
      stock: 8,
      description: 'Updated description',
      image: 'updated.jpg',
      status: 'active'
    };

    const updatedProduct: Product = {
      id: '1',
      ...updateData,
      category: 'Electronics',
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z'
    };

    vi.mocked(updateProductAction).mockResolvedValue(updatedProduct);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    let updatedResult: Product;
    await act(async () => {
      updatedResult = await result.current.updateProduct('1', updateData);
    });

    expect(updateProductAction).toHaveBeenCalledWith('1', updateData);
    expect(updatedResult!).toEqual(updatedProduct);

    const updatedProductInList = result.current.products.find(p => p.id === '1');
    expect(updatedProductInList).toEqual(updatedProduct);
  });

  test('should delete product successfully', async () => {
    vi.mocked(deleteProductAction).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    const initialCount = result.current.products.length;

    await act(async () => {
      await result.current.deleteProduct('1');
    });

    expect(deleteProductAction).toHaveBeenCalledWith('1');
    expect(result.current.products.length).toBe(initialCount - 1);
    expect(result.current.products.find(p => p.id === '1')).toBeUndefined();
  });

  test('should handle create product error', async () => {
    const newProductData: CreateProductData = {
      name: 'New Product',
      category: 'Electronics',
      price: 199.99,
      stock: 15,
      description: 'New description',
      image: 'new.jpg',
      status: 'active'
    };

    const errorMessage = 'Failed to create product';
    vi.mocked(createProductAction).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.createProduct(newProductData);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.products.length).toBe(2);
  });

  test('should refetch products', async () => {
    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    vi.mocked(getProductsAction).mockClear();

    await act(async () => {
      await result.current.refetchProducts();
    });

    expect(getProductsAction).toHaveBeenCalledTimes(1);
  });

  test('should return all required functions and properties', () => {
    const { result } = renderHook(() => useProducts());
    
    expect(result.current.products).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.isInitialLoading).toBeDefined();
    expect(result.current.error).toBeDefined();
    
    expect(typeof result.current.createProduct).toBe('function');
    expect(typeof result.current.updateProduct).toBe('function');
    expect(typeof result.current.deleteProduct).toBe('function');
    expect(typeof result.current.refetchProducts).toBe('function');
    expect(typeof result.current.setError).toBe('function');
  });

  test('should clear error when setError is called', async () => {
    vi.mocked(getProductsAction).mockRejectedValue(new Error('Initial error'));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.error).toBe('Initial error');
    });

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBe(null);
  });
});