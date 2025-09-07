import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useProducts } from '../../src/hooks/useProducts';
import { Product } from '../../src/types/product.interface';

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
  test('should initialize with provided products', () => {
    const { result } = renderHook(() => useProducts(mockProducts));
    
    expect(result.current.products).toBeDefined();
    expect(result.current.products.length).toBe(2);
    expect(result.current.products[0].name).toBe('Test Product 1');
    expect(result.current.products[1].name).toBe('Test Product 2');
  });

  test('should initialize with empty array when no products provided', () => {
    const { result } = renderHook(() => useProducts([]));
    
    expect(result.current.products).toBeDefined();
    expect(result.current.products.length).toBe(0);
  });

  test('should return all required functions', () => {
    const { result } = renderHook(() => useProducts(mockProducts));
    
    expect(result.current.handleAddProduct).toBeDefined();
    expect(result.current.handleEdit).toBeDefined();
    expect(result.current.handleView).toBeDefined();
    expect(result.current.handleDelete).toBeDefined();
    expect(typeof result.current.handleAddProduct).toBe('function');
    expect(typeof result.current.handleEdit).toBe('function');
    expect(typeof result.current.handleView).toBe('function');
    expect(typeof result.current.handleDelete).toBe('function');
  });

});