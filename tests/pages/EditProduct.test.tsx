import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ProductsContext } from '../../src/context/ProductsContext';
import { EditProduct } from '../../src/pages/EditProduct';
import type { Product } from '../../src/types/product.interface';

const { mockGoToDashboard, mockGoToDashboardWithMessage, mockGetProductByIdAction, mockProductFormProps } = vi.hoisted(() => ({
  mockGoToDashboard: vi.fn(),
  mockGoToDashboardWithMessage: vi.fn(),
  mockGetProductByIdAction: vi.fn(),
  mockProductFormProps: vi.fn(),
}));

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

vi.mock('../../src/actions/get-product-by-id-action', () => ({
  getProductByIdAction: mockGetProductByIdAction
}));

vi.mock('../../src/components/ProductForm', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ProductForm: (props: any) => {
    mockProductFormProps(props);
    return (
      <div data-testid="product-form">
        <button 
          data-testid="mock-cancel"
          onClick={() => props.onCancel && props.onCancel()}
        >
          Cancel
        </button>
        <span data-testid="is-edit">{props.isEdit ? 'true' : 'false'}</span>
        <span data-testid="product-id">{props.productId || 'none'}</span>
        <span data-testid="initial-data">{props.initialData?.name || 'none'}</span>
      </div>
    );
  }
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  category: 'Electronics',
  price: 99.99,
  stock: 10,
  description: 'Test description',
  image: 'https://example.com/image.jpg',
  status: 'active',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

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

const renderEditProduct = (productId = '1', contextOverrides = {}) => {
  const contextValue = { ...mockContextValue, ...contextOverrides };
  
  return render(
    <MemoryRouter initialEntries={[`/edit-product/${productId}`]}>
      <Routes>
        <Route path="/edit-product/:id" element={
          <ProductsContext.Provider value={contextValue}>
            <EditProduct />
          </ProductsContext.Provider>
        } />
      </Routes>
    </MemoryRouter>
  );
};

describe('EditProduct Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should show loading state initially', () => {
    mockGetProductByIdAction.mockImplementation(() => new Promise(() => {}));
    
    renderEditProduct();

    expect(screen.getByText('Edit Product')).toBeDefined();
    expect(screen.getByText('Loading product information...')).toBeDefined();
    expect(screen.getAllByText('Loading...')).toBeDefined();
  });

  test('should render edit form when product loads successfully', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderEditProduct();

    await waitFor(() => {
      expect(screen.getByText('Edit: Test Product')).toBeDefined();
    });

    expect(screen.getByText('Update product information')).toBeDefined();
    expect(screen.getByTestId('product-form')).toBeDefined();
    expect(screen.getByTestId('is-edit').textContent).toBe('true');
    expect(screen.getByTestId('product-id').textContent).toBe('1');
    expect(screen.getByTestId('initial-data').textContent).toBe('Test Product');
  });

  test('should call getProductByIdAction with correct ID', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderEditProduct('123');

    await waitFor(() => {
      expect(mockGetProductByIdAction).toHaveBeenCalledWith('123');
    });
  });

  test('should show error when product fetch fails', async () => {
    mockGetProductByIdAction.mockRejectedValue(new Error('Failed to load'));

    renderEditProduct();

    await waitFor(() => {
      expect(screen.getByText('Error loading product')).toBeDefined();
    });
  });

  test('should show not found when product is null', async () => {
    mockGetProductByIdAction.mockResolvedValue(null);

    renderEditProduct();

    await waitFor(() => {
      expect(screen.getByText('Product Not Found')).toBeDefined();
    });
  });

  test('should call goToDashboard when back button is clicked', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderEditProduct();

    await waitFor(() => {
      expect(screen.getByText('Back to Products')).toBeDefined();
    });

    const backButton = screen.getByText('Back to Products');
    fireEvent.click(backButton);

    expect(mockGoToDashboard).toHaveBeenCalledTimes(1);
  });

  test('should call goToDashboard when cancel is clicked in form', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderEditProduct();

    await waitFor(() => {
      expect(screen.getByTestId('mock-cancel')).toBeDefined();
    });

    const cancelButton = screen.getByTestId('mock-cancel');
    fireEvent.click(cancelButton);

    expect(mockGoToDashboard).toHaveBeenCalledTimes(1);
  });

  test('should pass correct props to ProductForm', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderEditProduct();

    await waitFor(() => {
      expect(screen.getByText('Edit: Test Product')).toBeDefined();
    });

    expect(mockProductFormProps).toHaveBeenCalledWith(
      expect.objectContaining({
        isEdit: true,
        productId: '1',
        initialData: mockProduct,
        onCancel: expect.any(Function)
      })
    );
  });

  test('should render with accessible structure', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderEditProduct();

    await waitFor(() => {
      expect(screen.getByText('Edit: Test Product')).toBeDefined();
    });

    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toBeDefined();
    expect(mainHeading.textContent).toBe('Edit: Test Product');

    const backButton = screen.getByRole('button', { name: /back to products/i });
    expect(backButton).toBeDefined();
  });
});