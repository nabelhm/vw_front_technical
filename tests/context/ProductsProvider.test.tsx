import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { useContext } from 'react';
import { ProductsProvider } from '../../src/context/ProductsProvider';
import { ProductsContext } from '../../src/context/ProductsContext';

vi.mock('../../src/hooks/useProducts', () => ({
  useProducts: vi.fn(() => ({
    products: [
      { id: '1', name: 'Test Product 1', category: 'Electronics', price: 100, stock: 10, status: 'active' },
      { id: '2', name: 'Test Product 2', category: 'Clothing', price: 50, stock: 5, status: 'inactive' }
    ],
    handleAddProduct: vi.fn(),
    handleEdit: vi.fn(),
    handleView: vi.fn(),
    handleDelete: vi.fn(),
  }))
}));

vi.mock('../../src/hooks/useFilters', () => ({
  useFilters: vi.fn(() => ({
    filteredProducts: [
      { id: '1', name: 'Test Product 1', category: 'Electronics', price: 100, stock: 10, status: 'active' }
    ],
    searchTerm: 'test',
    setSearchTerm: vi.fn(),
  }))
}));

vi.mock('../../src/hooks/useSort', () => ({
  useSort: vi.fn(() => ({
    sortedProducts: [
      { id: '1', name: 'Test Product 1', category: 'Electronics', price: 100, stock: 10, status: 'active' }
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
      <button onClick={context.handleAddProduct} data-testid="add-button">Add</button>
      <button onClick={() => context.handleEdit('1')} data-testid="edit-button">Edit</button>
      <button onClick={() => context.handleView('1')} data-testid="view-button">View</button>
      <button onClick={() => context.handleDelete('1')} data-testid="delete-button">Delete</button>
    </div>
  );
};

describe('ProductsProvider', () => {
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

  test('should provide all required functions', () => {
    render(
      <ProductsProvider>
        <TestChildComponent />
      </ProductsProvider>
    );

    const addButton = screen.getByTestId('add-button');
    const editButton = screen.getByTestId('edit-button');
    const viewButton = screen.getByTestId('view-button');
    const deleteButton = screen.getByTestId('delete-button');

    expect(addButton).toBeDefined();
    expect(editButton).toBeDefined();
    expect(viewButton).toBeDefined();
    expect(deleteButton).toBeDefined();
  });

  test('should pass filtered and sorted products as final products', () => {
    render(
      <ProductsProvider>
        <TestChildComponent />
      </ProductsProvider>
    );

    expect(screen.getByTestId('products-count').innerHTML).toBe('1');
  });
});