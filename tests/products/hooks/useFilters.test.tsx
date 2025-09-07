// __tests__/hooks/useFilters.test.tsx
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useFilters } from '../../../src/products/hooks/useFilters';
import type { Product } from '../../../src/products/types/product.interface';

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 14",
    category: "Electronics",
    price: 999.99,
    stock: 10,
    description: "Latest smartphone with advanced camera",
    image: "iphone.jpg",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 29.99,
    stock: 50,
    description: "Comfortable organic cotton shirt",
    image: "tshirt.jpg",
    status: "active",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Garden Hose",
    category: "Garden",
    price: 45.99,
    stock: 25,
    description: "Durable water hose for gardening",
    image: "hose.jpg",
    status: "inactive",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  }
];

describe('useFilters', () => {
  test('should initialize with empty search term and all products', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredProducts.length).toBe(3);
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  test('should filter products by name', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    act(() => {
      result.current.setSearchTerm('iPhone');
    });
    
    expect(result.current.filteredProducts.length).toBe(1);
    expect(result.current.filteredProducts[0].name).toBe('iPhone 14');
    expect(result.current.searchTerm).toBe('iPhone');
  });

  test('should filter products by category', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    act(() => {
      result.current.setSearchTerm('Electronics');
    });
    
    expect(result.current.filteredProducts.length).toBe(1);
    expect(result.current.filteredProducts[0].category).toBe('Electronics');
  });

  test('should filter products by description', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    act(() => {
      result.current.setSearchTerm('camera');
    });
    
    expect(result.current.filteredProducts.length).toBe(1);
    expect(result.current.filteredProducts[0].description).toContain('camera');
  });

  test('should be case insensitive', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    act(() => {
      result.current.setSearchTerm('IPHONE');
    });
    
    expect(result.current.filteredProducts.length).toBe(1);
    expect(result.current.filteredProducts[0].name).toBe('iPhone 14');
  });

  test('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    act(() => {
      result.current.setSearchTerm('nonexistent');
    });
    
    expect(result.current.filteredProducts.length).toBe(0);
  });

  test('should return all products when search term is cleared', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    act(() => {
      result.current.setSearchTerm('iPhone');
    });
    
    expect(result.current.filteredProducts.length).toBe(1);
    
    act(() => {
      result.current.setSearchTerm('');
    });
    
    expect(result.current.filteredProducts.length).toBe(3);
  });

  test('should handle empty products array', () => {
    const { result } = renderHook(() => useFilters([]));
    
    expect(result.current.filteredProducts.length).toBe(0);
    
    act(() => {
      result.current.setSearchTerm('test');
    });
    
    expect(result.current.filteredProducts.length).toBe(0);
  });

  test('should provide setSearchTerm function', () => {
    const { result } = renderHook(() => useFilters(mockProducts));
    
    expect(result.current.setSearchTerm).toBeDefined();
    expect(typeof result.current.setSearchTerm).toBe('function');
  });
});