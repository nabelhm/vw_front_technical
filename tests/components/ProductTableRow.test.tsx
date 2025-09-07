import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ProductTableRow } from '../../src/components/ProductTableRow';
import { ProductsContext } from '../../src/context/ProductsContext';
import type { Product } from '../../src/types/product.interface';

// Mock del hook de navegación
const mockGoToViewProduct = vi.fn();
const mockGoToEditProduct = vi.fn();

vi.mock('../../src/hooks/useProductNavigation', () => ({
  useProductNavigation: () => ({
    goToViewProduct: mockGoToViewProduct,
    goToEditProduct: mockGoToEditProduct,
    goToDashboard: vi.fn(),
    goToAddProduct: vi.fn(),
    goToDashboardWithMessage: vi.fn(),
    goBack: vi.fn(),
    goTo: vi.fn(),
    redirectTo: vi.fn(),
  })
}));

// Mock de window.confirm
const mockConfirm = vi.fn();
const mockAlert = vi.fn();
Object.defineProperty(window, 'confirm', { value: mockConfirm });
Object.defineProperty(window, 'alert', { value: mockAlert });

// Mock de console para evitar logs en tests
vi.mock('console', () => ({
  log: vi.fn(),
  error: vi.fn(),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  category: 'Electronics',
  price: 99.99,
  stock: 10,
  description: 'Test description',
  image: 'https://example.com/test.jpg',
  status: 'active',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

const mockInactiveProduct: Product = {
  ...mockProduct,
  id: '2',
  name: 'Inactive Product',
  status: 'inactive'
};

const mockDeleteProduct = vi.fn();

const mockContextValue = {
  products: [mockProduct],
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
  deleteProduct: mockDeleteProduct,
  refetchProducts: vi.fn(),
  setError: vi.fn(),
};

const renderWithContext = (product: Product, contextOverrides = {}) => {
  const contextValue = { ...mockContextValue, ...contextOverrides };
  
  return render(
    <ProductsContext.Provider value={contextValue}>
      <table>
        <tbody>
          <ProductTableRow product={product} />
        </tbody>
      </table>
    </ProductsContext.Provider>
  );
};

describe('ProductTableRow Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render product information correctly', () => {
    renderWithContext(mockProduct);

    expect(screen.getByText('Test Product')).toBeDefined();
    expect(screen.getByText('Electronics')).toBeDefined();
    expect(screen.getByText('10 units')).toBeDefined();
    expect(screen.getByText('99.99 €')).toBeDefined();
  });

  test('should show active status badge for active product', () => {
    renderWithContext(mockProduct);

    const activeBadge = screen.getByText('Active');
    expect(activeBadge).toBeDefined();
    expect(activeBadge.className).toContain('bg-success');
  });

  test('should show inactive status badge for inactive product', () => {
    renderWithContext(mockInactiveProduct);

    const inactiveBadge = screen.getByText('Inactive');
    expect(inactiveBadge).toBeDefined();
    expect(inactiveBadge.className).toContain('bg-danger');
  });

  test('should render all action buttons', () => {
    renderWithContext(mockProduct);

    const viewButton = screen.getByTitle('View product');
    const editButton = screen.getByTitle('Edit product');
    const deleteButton = screen.getByTitle('Delete product');

    expect(viewButton).toBeDefined();
    expect(editButton).toBeDefined();
    expect(deleteButton).toBeDefined();
  });

  test('should call goToViewProduct when view button is clicked', () => {
    renderWithContext(mockProduct);

    const viewButton = screen.getByTitle('View product');
    fireEvent.click(viewButton);

    expect(mockGoToViewProduct).toHaveBeenCalledTimes(1);
    expect(mockGoToViewProduct).toHaveBeenCalledWith('1');
  });

  test('should call goToEditProduct when edit button is clicked', () => {
    renderWithContext(mockProduct);

    const editButton = screen.getByTitle('Edit product');
    fireEvent.click(editButton);

    expect(mockGoToEditProduct).toHaveBeenCalledTimes(1);
    expect(mockGoToEditProduct).toHaveBeenCalledWith('1');
  });

  test('should show confirmation dialog when delete button is clicked', () => {
    mockConfirm.mockReturnValue(false); // Usuario cancela
    renderWithContext(mockProduct);

    const deleteButton = screen.getByTitle('Delete product');
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockConfirm).toHaveBeenCalledWith(
      'Are you sure you want to delete "Test Product"?'
    );
  });

  test('should not delete product when user cancels confirmation', () => {
    mockConfirm.mockReturnValue(false); // Usuario cancela
    renderWithContext(mockProduct);

    const deleteButton = screen.getByTitle('Delete product');
    fireEvent.click(deleteButton);

    expect(mockDeleteProduct).not.toHaveBeenCalled();
  });

  test('should delete product when user confirms', async () => {
    mockConfirm.mockReturnValue(true); // Usuario confirma
    mockDeleteProduct.mockResolvedValue(undefined); // Delete exitoso
    renderWithContext(mockProduct);

    const deleteButton = screen.getByTitle('Delete product');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteProduct).toHaveBeenCalledTimes(1);
      expect(mockDeleteProduct).toHaveBeenCalledWith('1');
    });
  });

  test('should handle delete error gracefully', async () => {
    mockConfirm.mockReturnValue(true);
    const deleteError = new Error('Delete failed');
    mockDeleteProduct.mockRejectedValue(deleteError);
    renderWithContext(mockProduct);

    const deleteButton = screen.getByTitle('Delete product');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteProduct).toHaveBeenCalledWith('1');
      expect(mockAlert).toHaveBeenCalledWith('Failed to delete product. Please try again.');
    });
  });

  test('should format price correctly with two decimal places', () => {
    const productWithOddPrice = {
      ...mockProduct,
      price: 123.5 // Should display as 123.50
    };
    renderWithContext(productWithOddPrice);

    expect(screen.getByText('123.50 €')).toBeDefined();
  });

  test('should handle zero stock correctly', () => {
    const productWithZeroStock = {
      ...mockProduct,
      stock: 0
    };
    renderWithContext(productWithZeroStock);

    expect(screen.getByText('0 units')).toBeDefined();
  });

  test('should display product name with correct styling', () => {
    renderWithContext(mockProduct);

    const productName = screen.getByText('Test Product');
    expect(productName.className).toContain('fw-medium');
  });

  test('should have proper button group structure', () => {
    renderWithContext(mockProduct);

    const buttonGroup = screen.getByRole('group');
    expect(buttonGroup).toBeDefined();
    expect(buttonGroup.className).toContain('btn-group');
  });

  test('should handle very long product names', () => {
    const productWithLongName = {
      ...mockProduct,
      name: 'This is a very long product name that should be displayed properly without breaking the layout'
    };
    renderWithContext(productWithLongName);

    expect(screen.getByText(productWithLongName.name)).toBeDefined();
  });
});