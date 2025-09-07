import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ProductsContext } from '../../src/context/ProductsContext';
import { ProductForm } from '../../src/components/ProductForm';
import type { Product } from '../../src/types/product.interface';

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

const fillValidForm = async () => {
  fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Integration Test Product' } });
  fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Electronics' } });
  fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '129.99' } });
  fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: '25' } });
  fireEvent.change(screen.getByLabelText(/product description/i), { target: { value: 'Integration test description' } });
  fireEvent.change(screen.getByLabelText(/image url/i), { target: { value: 'https://example.com/integration.jpg' } });
  fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'active' } });
};

describe('ProductForm Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Product Flow', () => {
    test('should create product successfully with complete flow', async () => {
      mockCreateProduct.mockResolvedValue(mockProduct);
      renderProductForm();

      await fillValidForm();

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith(null);
        expect(mockCreateProduct).toHaveBeenCalledWith(expect.objectContaining({
          name: 'Integration Test Product',
          category: 'Electronics',
          description: 'Integration test description',
          image: 'https://example.com/integration.jpg',
          status: 'active'
        }));
        expect(mockGoToDashboardWithMessage).toHaveBeenCalledWith('Product created successfully!');
      });
    });

    test('should handle create error and show error message', async () => {
      mockCreateProduct.mockRejectedValue(new Error('Network error'));
      renderProductForm();

      await fillValidForm();

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith('Error creating product. Please try again.');
        expect(mockGoToDashboardWithMessage).not.toHaveBeenCalled();
      });
    });
  });

  describe('Update Product Flow', () => {
    test('should update product successfully with complete flow', async () => {
      mockUpdateProduct.mockResolvedValue({ ...mockProduct, name: 'Updated Product' });
      
      renderProductForm({
        isEdit: true,
        productId: '1',
        initialData: mockProduct
      });

      const nameInput = screen.getByDisplayValue('Test Product');
      fireEvent.change(nameInput, { target: { value: 'Updated Product Name' } });

      const submitButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith(null);
        expect(mockUpdateProduct).toHaveBeenCalledWith('1', expect.objectContaining({
          name: 'Updated Product Name',
          category: 'Electronics'
        }));
        expect(mockGoToDashboardWithMessage).toHaveBeenCalledWith('Product updated successfully!');
      });
    });

    test('should handle update error and show error message', async () => {
      mockUpdateProduct.mockRejectedValue(new Error('Update failed'));
      
      renderProductForm({
        isEdit: true,
        productId: '1',
        initialData: mockProduct
      });

      const submitButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith('Error updating product. Please try again.');
        expect(mockGoToDashboardWithMessage).not.toHaveBeenCalled();
      });
    });

    test('should preserve data integrity during update', async () => {
      mockUpdateProduct.mockResolvedValue(mockProduct);
      
      renderProductForm({
        isEdit: true,
        productId: '1',
        initialData: mockProduct
      });

      expect(screen.getByDisplayValue('Test Product')).toBeDefined();
      expect(screen.getByDisplayValue('Electronics')).toBeDefined();
      expect(screen.getByDisplayValue('99.99')).toBeDefined();
      expect(screen.getByDisplayValue('10')).toBeDefined();

      fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '199.99' } });

      const submitButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateProduct).toHaveBeenCalledWith('1', expect.objectContaining({
          name: 'Test Product',
          category: 'Electronics',
          description: 'Test description',
          image: 'https://example.com/image.jpg',
          status: 'active'
        }));
      });
    });
  });

  describe('Error Handling Integration', () => {
    test('should display and clear error messages correctly', async () => {
      renderProductForm({}, { error: 'Initial error message' });

      expect(screen.getByText('Initial error message')).toBeDefined();

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(mockSetError).toHaveBeenCalledWith(null);
    });

    test('should clear errors before new submission', async () => {
      mockCreateProduct.mockResolvedValue(mockProduct);
      renderProductForm({}, { error: 'Previous error' });

      expect(screen.getByText('Previous error')).toBeDefined();

      await fillValidForm();

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('Form Validation Integration', () => {
    test('should prevent submission with invalid data', async () => {
      renderProductForm();

      fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'A' } });
      fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Electronics' } });
      fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '0' } });
      fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: '-1' } });

      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Product name must be at least 2 characters')).toBeDefined();
        expect(screen.getByText('Price must be greater than 0')).toBeDefined();
        expect(screen.getByText('Stock cannot be negative')).toBeDefined();
      });

      expect(mockCreateProduct).not.toHaveBeenCalled();
      expect(mockGoToDashboardWithMessage).not.toHaveBeenCalled();
    });

    test('should validate and submit only when all fields are valid', async () => {
      mockCreateProduct.mockResolvedValue(mockProduct);
      renderProductForm();

      fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'A' } });
      fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Electronics' } });
      fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '99.99' } });
      fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: '10' } });

      let submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Product name must be at least 2 characters')).toBeDefined();
      });

      expect(mockCreateProduct).not.toHaveBeenCalled();

      fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Valid Product Name' } });

      submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateProduct).toHaveBeenCalledWith(expect.objectContaining({
          name: 'Valid Product Name',
          category: 'Electronics',
          description: '',
          image: '',
          status: 'active'
        }));
      });
    });
  });

  describe('Navigation Integration', () => {
    test('should handle custom cancel callback', () => {
      const mockCustomCancel = vi.fn();
      renderProductForm({ onCancel: mockCustomCancel });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockCustomCancel).toHaveBeenCalledTimes(1);
      expect(mockGoToDashboard).not.toHaveBeenCalled();
    });

    test('should use default navigation when no cancel callback provided', () => {
      renderProductForm();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockGoToDashboard).toHaveBeenCalledTimes(1);
    });
  });

});