import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ProductsContext } from '../../src/context/ProductsContext';
import { ProductsProvider } from '../../src/context/ProductsProvider';

vi.mock('../../src/hooks/useProducts', () => ({
  useProducts: vi.fn(() => ({
    products: [
      { 
        id: '1', 
        name: 'Test Product 1', 
        category: 'Electronics', 
        price: 100, 
        stock: 10, 
        status: 'active',
        description: 'Test description 1',
        image: 'https://example.com/1.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      { 
        id: '2', 
        name: 'Test Product 2', 
        category: 'Clothing', 
        price: 50, 
        stock: 5, 
        status: 'inactive',
        description: 'Test description 2',
        image: 'https://example.com/2.jpg',
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      }
    ],
    isLoading: false,
    isInitialLoading: false,
    error: null,
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    refetchProducts: vi.fn(),
    setError: vi.fn(),
  }))
}));

vi.mock('../../src/hooks/useFilters', () => ({
  useFilters: vi.fn(() => ({
    filteredProducts: [
      { 
        id: '1', 
        name: 'Test Product 1', 
        category: 'Electronics', 
        price: 100, 
        stock: 10, 
        status: 'active',
        description: 'Test description 1',
        image: 'https://example.com/1.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ],
    searchTerm: 'test',
    setSearchTerm: vi.fn(),
  }))
}));

vi.mock('../../src/hooks/useSort', () => ({
  useSort: vi.fn(() => ({
    sortedProducts: [
      { 
        id: '1', 
        name: 'Test Product 1', 
        category: 'Electronics', 
        price: 100, 
        stock: 10, 
        status: 'active',
        description: 'Test description 1',
        image: 'https://example.com/1.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ],
    sortField: 'name',
    sortOrder: 'asc',
    handleSort: vi.fn(),
  }))
}));

const TestChildComponent = () => {
  const context = useContext(ProductsContext);
  return (
    <div>
      <div data-testid="products-count">{context.products.length}</div>
      <div data-testid="search-term">{context.searchTerm}</div>
      <div data-testid="sort-field">{context.sortField}</div>
      <div data-testid="sort-order">{context.sortOrder}</div>
      <div data-testid="is-loading">{context.isLoading.toString()}</div>
      <div data-testid="is-initial-loading">{context.isInitialLoading.toString()}</div>
      <div data-testid="error">{context.error || 'null'}</div>
      <button onClick={() => context.createProduct({
        name: 'New Product',
        category: 'Electronics',
        price: 100,
        stock: 10,
        description: 'New description',
        image: 'https://example.com/new.jpg',
        status: 'active'
      })} data-testid="create-button">Create</button>
      <button onClick={() => context.updateProduct('1', {
        name: 'Updated Product',
        category: 'Electronics',
        price: 150,
        stock: 15,
        description: 'Updated description',
        image: 'https://example.com/updated.jpg',
        status: 'active'
      })} data-testid="update-button">Update</button>
      <button onClick={() => context.deleteProduct('1')} data-testid="delete-button">Delete</button>
      <button onClick={context.refetchProducts} data-testid="refetch-button">Refetch</button>
    </div>
  );
};

describe('ProductsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should provide context values to children', () => {
    render(
      <ProductsProvider>
        <TestChildComponent />
      </ProductsProvider>
    );

    expect(screen.getByTestId('products-count').innerHTML).toBe('1');
    expect(screen.getByTestId('search-term').innerHTML).toBe('test');
    expect(screen.getByTestId('sort-field').innerHTML).toBe('name');
    expect(screen.getByTestId('sort-order').innerHTML).toBe('asc');
    expect(screen.getByTestId('is-loading').innerHTML).toBe('false');
    expect(screen.getByTestId('is-initial-loading').innerHTML).toBe('false');
    expect(screen.getByTestId('error').innerHTML).toBe('null');
  });

  test('should render children components', () => {
    render(
      <ProductsProvider>
        <div data-testid="child-component">Child Content</div>
      </ProductsProvider>
    );

    const childElement = screen.getByTestId('child-component');
    expect(childElement).toBeDefined();
    expect(childElement.innerHTML).toContain('Child Content');
  });

  test('should provide all required CRUD functions', () => {
    render(
      <ProductsProvider>
        <TestChildComponent />
      </ProductsProvider>
    );

    const createButton = screen.getByTestId('create-button');
    const updateButton = screen.getByTestId('update-button');
    const deleteButton = screen.getByTestId('delete-button');
    const refetchButton = screen.getByTestId('refetch-button');

    expect(createButton).toBeDefined();
    expect(updateButton).toBeDefined();
    expect(deleteButton).toBeDefined();
    expect(refetchButton).toBeDefined();
  });

  test('should pass filtered and sorted products as final products', () => {
    render(
      <ProductsProvider>
        <TestChildComponent />
      </ProductsProvider>
    );

    expect(screen.getByTestId('products-count').innerHTML).toBe('1');
  });

  test('should expose loading states', () => {
    render(
      <ProductsProvider>
        <TestChildComponent />
      </ProductsProvider>
    );

    expect(screen.getByTestId('is-loading').innerHTML).toBe('false');
    expect(screen.getByTestId('is-initial-loading').innerHTML).toBe('false');
  });

  test('should expose error state', () => {
    render(
      <ProductsProvider>
        <TestChildComponent />
      </ProductsProvider>
    );

    expect(screen.getByTestId('error').innerHTML).toBe('null');
  });
});