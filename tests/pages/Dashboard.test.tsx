import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Dashboard } from '../../src/pages/Dashboard';
import { ProductsContext } from '../../src/context/ProductsContext';

vi.mock('../../src/components/Header', () => ({
  Header: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div data-testid="header">
      <h1 data-testid="header-title">{title}</h1>
      {subtitle && <p data-testid="header-subtitle">{subtitle}</p>}
    </div>
  )
}));

vi.mock('../../src/components/ProductActionsBar', () => ({
  ProductActionsBar: () => (
    <div data-testid="product-actions-bar">Product Actions Bar</div>
  )
}));

vi.mock('../../src/components/ProductTable', () => ({
  ProductTable: () => (
    <div data-testid="product-table">Product Table</div>
  )
}));

vi.mock('../../src/hooks/useProductNavigation', () => ({
  useProductNavigation: () => ({
    goToDashboard: vi.fn(),
    goToDashboardWithMessage: vi.fn(),
    goToViewProduct: vi.fn(),
    goToEditProduct: vi.fn(),
    goToAddProduct: vi.fn(),
    goBack: vi.fn(),
    goTo: vi.fn(),
    redirectTo: vi.fn(),
  })
}));

const mockContextValue = {
  products: [
    {
      id: '1',
      name: 'Test Product 1',
      category: 'Electronics',
      price: 99.99,
      stock: 10,
      description: 'Test description',
      image: 'https://example.com/test1.jpg',
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  isLoading: false,
  isInitialLoading: false,
  error: null,
  searchTerm: '',
  sortField: 'name' as const,
  sortOrder: 'asc' as const,
  handleSort: vi.fn(),
  setSearchTerm: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  refetchProducts: vi.fn(),
  setError: vi.fn(),
};

const renderDashboard = (contextOverrides = {}) => {
  const contextValue = { ...mockContextValue, ...contextOverrides };
  
  return render(
    <MemoryRouter>
      <ProductsContext.Provider value={contextValue}>
        <Dashboard />
      </ProductsContext.Provider>
    </MemoryRouter>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render all main components', () => {
    renderDashboard();

    expect(screen.getByTestId('header')).toBeDefined();
    expect(screen.getByTestId('product-actions-bar')).toBeDefined();
    expect(screen.getByTestId('product-table')).toBeDefined();
  });

  test('should pass correct props to Header component', () => {
    renderDashboard();

    expect(screen.getByTestId('header-title').textContent).toBe('Product Management');
    expect(screen.getByTestId('header-subtitle').textContent).toBe('Manage your products effectively');
  });

  test('should work with empty products list', () => {
    const emptyContext = {
      products: [],
      isLoading: false,
      isInitialLoading: false,
      error: null
    };

    renderDashboard(emptyContext);

    expect(screen.getByTestId('header')).toBeDefined();
    expect(screen.getByTestId('product-actions-bar')).toBeDefined();
    expect(screen.getByTestId('product-table')).toBeDefined();
  });

  test('should work with multiple products', () => {
    const multipleProductsContext = {
      products: [
        {
          id: '1',
          name: 'Product 1',
          category: 'Electronics',
          price: 99.99,
          stock: 10,
          description: 'Description 1',
          image: 'image1.jpg',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          name: 'Product 2',
          category: 'Clothing',
          price: 49.99,
          stock: 5,
          description: 'Description 2',
          image: 'image2.jpg',
          status: 'inactive',
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z'
        }
      ]
    };

    renderDashboard(multipleProductsContext);

    expect(screen.getByTestId('header')).toBeDefined();
    expect(screen.getByTestId('product-actions-bar')).toBeDefined();
    expect(screen.getByTestId('product-table')).toBeDefined();
  });

  test('should be accessible', () => {
    renderDashboard();

    const heading = screen.getByTestId('header-title');
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe('Product Management');

    expect(screen.getByTestId('header')).toBeDefined();
    expect(screen.getByTestId('product-actions-bar')).toBeDefined();
    expect(screen.getByTestId('product-table')).toBeDefined();
  });
});