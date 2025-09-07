import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ProductsContext } from '../../src/context/ProductsContext';
import { ProductForm } from '../../src/components/ProductForm';

const { mockGoToDashboard, mockGoToDashboardWithMessage } = vi.hoisted(() => ({
  mockGoToDashboard: vi.fn(),
  mockGoToDashboardWithMessage: vi.fn(),
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

const mockCreateProduct = vi.fn();
const mockUpdateProduct = vi.fn();
const mockSetError = vi.fn();

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
  createProduct: mockCreateProduct,
  updateProduct: mockUpdateProduct,
  deleteProduct: vi.fn(),
  refetchProducts: vi.fn(),
  setError: mockSetError,
};

const renderProductForm = (props = {}, contextOverrides = {}) => {
  const contextValue = { ...mockContextValue, ...contextOverrides };
  
  return render(
    <MemoryRouter>
      <ProductsContext.Provider value={contextValue}>
        <ProductForm {...props} />
      </ProductsContext.Provider>
    </MemoryRouter>
  );
};

describe('ProductForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render all form fields', () => {
    renderProductForm();

    expect(screen.getByLabelText(/product name/i)).toBeDefined();
    expect(screen.getByLabelText(/category/i)).toBeDefined();
    expect(screen.getByLabelText(/price/i)).toBeDefined();
    expect(screen.getByLabelText(/stock quantity/i)).toBeDefined();
    expect(screen.getByLabelText(/image url/i)).toBeDefined();
    expect(screen.getByLabelText(/product description/i)).toBeDefined();
    expect(screen.getByLabelText(/status/i)).toBeDefined();
  });

  test('should render create button when not in edit mode', () => {
    renderProductForm();

    expect(screen.getByRole('button', { name: /create/i })).toBeDefined();
    expect(screen.queryByRole('button', { name: /update/i })).toBe(null);
  });

  test('should render update button when in edit mode', () => {
    renderProductForm({ isEdit: true });

    expect(screen.getByRole('button', { name: /update/i })).toBeDefined();
    expect(screen.queryByRole('button', { name: /create/i })).toBe(null);
  });

  test('should populate fields with initial data', () => {
    const initialData = {
      name: 'Test Product',
      category: 'Electronics',
      price: 99.99,
      stock: 10,
      description: 'Test description',
      image: 'https://example.com/image.jpg',
      status: 'active'
    };

    renderProductForm({
      isEdit: true,
      initialData
    });

    expect(screen.getByDisplayValue('Test Product')).toBeDefined();
    expect(screen.getByDisplayValue('99.99')).toBeDefined();
    expect(screen.getByDisplayValue('10')).toBeDefined();
    expect(screen.getByDisplayValue('Test description')).toBeDefined();
    expect(screen.getByDisplayValue('https://example.com/image.jpg')).toBeDefined();
  });

  test('should validate minimum name length', async () => {
    renderProductForm();

    const nameInput = screen.getByLabelText(/product name/i);
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Product name must be at least 2 characters')).toBeDefined();
    });
  });

  test('should validate price range', async () => {
    renderProductForm();

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '0' } });
    
    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Price must be greater than 0')).toBeDefined();
    });
  });

  test('should call onCancel prop when provided', () => {
    const mockOnCancel = vi.fn();
    renderProductForm({ onCancel: mockOnCancel });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockGoToDashboard).not.toHaveBeenCalled();
  });

  test('should call goToDashboard when onCancel not provided', () => {
    renderProductForm();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockGoToDashboard).toHaveBeenCalledTimes(1);
  });

  test('should display error message from context', () => {
    renderProductForm({}, { error: 'Test error message' });

    expect(screen.getByText('Test error message')).toBeDefined();
  });

  test('should clear error when dismissed', () => {
    renderProductForm({}, { error: 'Test error message' });

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  test('should render all category options', () => {
    renderProductForm();

    expect(screen.getByText('Kitchen')).toBeDefined();
    expect(screen.getByText('Electronics')).toBeDefined();
    expect(screen.getByText('Garden')).toBeDefined();
    expect(screen.getByText('Construction')).toBeDefined();
    expect(screen.getByText('Sports')).toBeDefined();
    expect(screen.getByText('Clothing')).toBeDefined();
  });

  test('should default to active status', () => {
    renderProductForm();

    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect.value).toBe('active');
  });

  test('should show character count for description', () => {
    renderProductForm();

    const descriptionInput = screen.getByLabelText(/product description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    expect(screen.getByText('16/500 characters')).toBeDefined();
  });
});