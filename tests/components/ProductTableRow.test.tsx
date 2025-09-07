import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ProductTableRow } from '../../src/components/ProductTableRow';
import { ProductsContext } from '../../src/context/ProductsContext';
import type { Product } from '../../src/types/product.interface';

const mockProduct: Product = {
  id: "test-id-123",
  name: "Test Product",
  category: "Electronics",
  price: 99.99,
  stock: 15,
  description: "Test description",
  image: "test.jpg",
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const mockInactiveProduct: Product = {
  ...mockProduct,
  id: "inactive-id",
  name: "Inactive Product",
  status: "inactive"
};

const mockContextValue = {
  products: [],
  searchTerm: '',
  setSearchTerm: vi.fn(),
  sortField: 'name' as const,
  sortOrder: 'asc' as const,
  handleSort: vi.fn(),
  handleAddProduct: vi.fn(),
  handleEdit: vi.fn(),
  handleView: vi.fn(),
  handleDelete: vi.fn(),
};

describe('ProductTableRow Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithContext = (product: Product, contextValue = mockContextValue) => {
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

  test('should render product information correctly', () => {
    renderWithContext(mockProduct);
    
    expect(screen.getByText('Test Product')).toBeDefined();
    expect(screen.getByText('Electronics')).toBeDefined();
    expect(screen.getByText('15 units')).toBeDefined();
    expect(screen.getByText('99.99 €')).toBeDefined();
  });

  test('should render active status badge correctly', () => {
    renderWithContext(mockProduct);
    
    const statusBadge = screen.getByText('Active');
    expect(statusBadge).toBeDefined();
    expect(statusBadge.className).toContain('badge');
    expect(statusBadge.className).toContain('bg-success');
  });

  test('should render inactive status badge correctly', () => {
    renderWithContext(mockInactiveProduct);
    
    const statusBadge = screen.getByText('Inactive');
    expect(statusBadge).toBeDefined();
    expect(statusBadge.className).toContain('badge');
    expect(statusBadge.className).toContain('bg-danger');
  });

  test('should render action buttons with correct icons', () => {
    const { container } = renderWithContext(mockProduct);
    
    const viewIcon = container.querySelector('.bi-eye');
    const editIcon = container.querySelector('.bi-pencil');
    const deleteIcon = container.querySelector('.bi-trash');
    
    expect(viewIcon).toBeDefined();
    expect(editIcon).toBeDefined();
    expect(deleteIcon).toBeDefined();
  });

  test('should call handleView when view button is clicked', () => {
    const { container } = renderWithContext(mockProduct);
    
    const viewButton = container.querySelector('.bi-eye')?.closest('button');
    expect(viewButton).toBeDefined();
    
    fireEvent.click(viewButton!);
    expect(mockContextValue.handleView).toHaveBeenCalledWith('test-id-123');
  });

  test('should call handleEdit when edit button is clicked', () => {
    const { container } = renderWithContext(mockProduct);
    
    const editButton = container.querySelector('.bi-pencil')?.closest('button');
    expect(editButton).toBeDefined();
    
    fireEvent.click(editButton!);
    expect(mockContextValue.handleEdit).toHaveBeenCalledWith('test-id-123');
  });

  test('should call handleDelete when delete button is clicked', () => {
    const { container } = renderWithContext(mockProduct);
    
    const deleteButton = container.querySelector('.bi-trash')?.closest('button');
    expect(deleteButton).toBeDefined();
    
    fireEvent.click(deleteButton!);
    expect(mockContextValue.handleDelete).toHaveBeenCalledWith('test-id-123');
  });

  test('should have correct button styling', () => {
    const { container } = renderWithContext(mockProduct);
    
    const buttons = container.querySelectorAll('button');
    
    buttons.forEach(button => {
      expect(button.className).toContain('btn');
      expect(button.className).toContain('btn-outline-secondary');
      expect(button.className).toContain('btn-sm');
      expect(button.className).toContain('border-0');
    });
    
    const deleteButton = container.querySelector('.bi-trash')?.closest('button');
    expect(deleteButton?.className).toContain('text-danger');
  });

  test('should format price correctly with two decimal places', () => {
    const productWithPrice = { ...mockProduct, price: 50 };
    renderWithContext(productWithPrice);

    expect(screen.getByText('50.00 €')).toBeDefined();
  });
});