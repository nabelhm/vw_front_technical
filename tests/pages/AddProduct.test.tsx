import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ProductsContext } from '../../src/context/ProductsContext';
import { AddProduct } from '../../src/pages/AddProduct';

const mockGoToDashboard = vi.fn();
const mockGoToDashboardWithMessage = vi.fn();

vi.mock('../../src/hooks/useProductNavigation', () => ({
  useProductNavigation: () => ({
    goToDashboard: mockGoToDashboard,
    goToDashboardWithMessage: mockGoToDashboardWithMessage,
    goToViewProduct: vi.fn(),
    goToEditProduct: vi.fn(),
    goToAddProduct: vi.fn(),
    goBack: vi.fn(),
    goTo: vi.fn(),
    redirectTo: vi.fn(),
  })
}));

const mockProductFormProps = vi.fn();
vi.mock('../../src/components/ProductForm', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ProductForm: (props: any) => {
    mockProductFormProps(props);
    return (
      <div data-testid="product-form">
        <button 
          data-testid="mock-submit"
          onClick={() => props.onCancel && props.onCancel()}
        >
          Mock Submit
        </button>
        <span data-testid="is-edit">{props.isEdit ? 'true' : 'false'}</span>
      </div>
    );
  }
}));

const mockContextValue = {
  products: [],
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

const renderAddProduct = (contextOverrides = {}) => {
  const contextValue = { ...mockContextValue, ...contextOverrides };
  
  return render(
    <MemoryRouter>
      <ProductsContext.Provider value={contextValue}>
        <AddProduct />
      </ProductsContext.Provider>
    </MemoryRouter>
  );
};

describe('AddProduct Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render page header correctly', () => {
    renderAddProduct();

    expect(screen.getByText('Add New Product')).toBeDefined();
    expect(screen.getByText('Create a new product')).toBeDefined();
  });

  test('should call goToDashboard when back button is clicked', () => {
    renderAddProduct();

    const backButton = screen.getByText('Back to Products');
    fireEvent.click(backButton);

    expect(mockGoToDashboard).toHaveBeenCalledTimes(1);
  });

  test('should render ProductForm component', () => {
    renderAddProduct();

    const productForm = screen.getByTestId('product-form');
    expect(productForm).toBeDefined();
  });

  test('should render with accessible structure', () => {
    renderAddProduct();

    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toBeDefined();
    expect(mainHeading.textContent).toBe('Add New Product');

    const backButton = screen.getByRole('button', { name: /back to products/i });
    expect(backButton).toBeDefined();
  });
});