// __tests__/hooks/useSort.test.tsx
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useSort } from '../../src/hooks/useSort';
import type { Product } from '../../src/types/product.interface';

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Zebra Product",
    category: "Electronics",
    price: 100.99,
    stock: 5,
    description: "Last product alphabetically",
    image: "zebra.jpg",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Apple Product",
    category: "Garden",
    price: 50.99,
    stock: 20,
    description: "First product alphabetically",
    image: "apple.jpg",
    status: "inactive",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Middle Product",
    category: "Clothing",
    price: 75.99,
    stock: 10,
    description: "Middle product alphabetically",
    image: "middle.jpg",
    status: "active",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  }
];

describe('useSort', () => {
  test('should initialize with name field and asc order', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    expect(result.current.sortField).toBe('name');
    expect(result.current.sortOrder).toBe('asc');
    expect(result.current.sortedProducts.length).toBe(3);
  });

  test('should sort products by name in ascending order by default', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    expect(result.current.sortedProducts[0].name).toBe('Apple Product');
    expect(result.current.sortedProducts[1].name).toBe('Middle Product');
    expect(result.current.sortedProducts[2].name).toBe('Zebra Product');
  });

  test('should toggle sort order when clicking same field', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    act(() => {
      result.current.handleSort('name');
    });
    
    expect(result.current.sortOrder).toBe('desc');
    expect(result.current.sortedProducts[0].name).toBe('Zebra Product');
    expect(result.current.sortedProducts[2].name).toBe('Apple Product');
  });

  test('should change field and reset to asc when clicking different field', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    act(() => {
      result.current.handleSort('price');
    });
    
    expect(result.current.sortField).toBe('price');
    expect(result.current.sortOrder).toBe('asc');
    expect(result.current.sortedProducts[0].price).toBe(50.99);
    expect(result.current.sortedProducts[2].price).toBe(100.99);
  });

  test('should sort by price correctly', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    act(() => {
      result.current.handleSort('price');
    });
    
    expect(result.current.sortedProducts[0].price).toBe(50.99);
    expect(result.current.sortedProducts[1].price).toBe(75.99);
    expect(result.current.sortedProducts[2].price).toBe(100.99);
  });

  test('should sort by stock correctly', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    act(() => {
      result.current.handleSort('stock');
    });
    
    expect(result.current.sortedProducts[0].stock).toBe(5);
    expect(result.current.sortedProducts[1].stock).toBe(10);
    expect(result.current.sortedProducts[2].stock).toBe(20);
  });

  test('should sort by category correctly', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    act(() => {
      result.current.handleSort('category');
    });
    
    expect(result.current.sortedProducts[0].category).toBe('Clothing');
    expect(result.current.sortedProducts[1].category).toBe('Electronics');
    expect(result.current.sortedProducts[2].category).toBe('Garden');
  });

  test('should sort by status correctly', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    act(() => {
      result.current.handleSort('status');
    });
    
    expect(result.current.sortedProducts[0].status).toBe('active');
    expect(result.current.sortedProducts[2].status).toBe('inactive');
  });

  test('should handle empty products array', () => {
    const { result } = renderHook(() => useSort([]));
    
    expect(result.current.sortedProducts.length).toBe(0);
    
    act(() => {
      result.current.handleSort('name');
    });
    
    expect(result.current.sortedProducts.length).toBe(0);
  });

  test('should provide handleSort function', () => {
    const { result } = renderHook(() => useSort(mockProducts));
    
    expect(result.current.handleSort).toBeDefined();
    expect(typeof result.current.handleSort).toBe('function');
  });
});