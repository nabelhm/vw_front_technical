import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ProductTable } from '../../../src/products/components/ProductTable';
import { ProductsContext } from '../../../src/products/context/ProductsContext';
import type { Product, SortField, SortOrder } from '../../../src/products/types/product.interface';

vi.mock('../../../src/products/components/ProductTableRow', () => ({
  ProductTableRow: ({ product }: { product: Product }) => (
    <tr data-testid={`product-row-${product.id}`}>
      <td>{product.name}</td>
    </tr>
  )
}));

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Product A",
    category: "Electronics",
    price: 100,
    stock: 10,
    description: "Description A",
    image: "imageA.jpg",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Product B",
    category: "Clothing",
    price: 50,
    stock: 5,
    description: "Description B",
    image: "imageB.jpg",
    status: "inactive",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  }
];

const mockContextValue = {
  products: mockProducts,
  searchTerm: '',
  setSearchTerm: vi.fn(),
  sortField: 'name' as SortField,
  sortOrder: 'asc' as SortOrder,
  handleSort: vi.fn(),
  handleAddProduct: vi.fn(),
  handleEdit: vi.fn(),
  handleView: vi.fn(),
  handleDelete: vi.fn(),
};

describe('ProductTable Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <ProductsContext.Provider value={contextValue}>
        <ProductTable />
      </ProductsContext.Provider>
    );
  };

  test('should render table headers correctly', () => {
    renderWithContext();
    
    expect(screen.getByText('Product Name')).toBeDefined();
    expect(screen.getByText('Category')).toBeDefined();
    expect(screen.getByText('Stock Levels')).toBeDefined();
    expect(screen.getByText('Price')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
  });

  test('should render ProductTableRow components for each product', () => {
    renderWithContext();
    
    expect(screen.getByTestId('product-row-1')).toBeDefined();
    expect(screen.getByTestId('product-row-2')).toBeDefined();
  });

  test('should show "No products found" when products array is empty', () => {
    const emptyContextValue = {
      ...mockContextValue,
      products: []
    };
    
    renderWithContext(emptyContextValue);
    
    expect(screen.getByText('No products found.')).toBeDefined();
  });

  test('should call handleSort when clicking on sortable headers', () => {
    renderWithContext();
    
    const nameHeader = screen.getByText('Product Name');
    const categoryHeader = screen.getByText('Category');
    const stockHeader = screen.getByText('Stock Levels');
    const priceHeader = screen.getByText('Price');
    const statusHeader = screen.getByText('Status');
    
    fireEvent.click(nameHeader);
    expect(mockContextValue.handleSort).toHaveBeenCalledWith('name');
    
    fireEvent.click(categoryHeader);
    expect(mockContextValue.handleSort).toHaveBeenCalledWith('category');
    
    fireEvent.click(stockHeader);
    expect(mockContextValue.handleSort).toHaveBeenCalledWith('stock');
    
    fireEvent.click(priceHeader);
    expect(mockContextValue.handleSort).toHaveBeenCalledWith('price');
    
    fireEvent.click(statusHeader);
    expect(mockContextValue.handleSort).toHaveBeenCalledWith('status');
  });

  test('should display correct sort icon for active sort field ascending', () => {
    const { container } = renderWithContext();
    
    const activeIcon = container.querySelector('.bi-arrow-up.text-primary');
    expect(activeIcon).toBeDefined();
    expect(activeIcon?.className).toContain('small');
  });

  test('should display correct sort icon for active sort field descending', () => {
    const descContextValue = {
      ...mockContextValue,
      sortOrder: 'desc' as SortOrder
    };
    
    const { container } = renderWithContext(descContextValue);
    
    const activeIcon = container.querySelector('.bi-arrow-down.text-primary');
    expect(activeIcon).toBeDefined();
    expect(activeIcon?.className).toContain('small');
  });

  test('should display neutral sort icon for inactive sort fields', () => {
    const { container } = renderWithContext();
    
    const neutralIcons = container.querySelectorAll('.bi-arrow-down-up.text-muted');
    expect(neutralIcons.length).toBeGreaterThan(0);
  });

  test('should have correct table structure and classes', () => {
    const { container } = renderWithContext();
    
    const tableResponsive = container.querySelector('.table-responsive');
    expect(tableResponsive).toBeDefined();
    
    const table = container.querySelector('.table.table-bordered.table-hover');
    expect(table).toBeDefined();
    
    const thead = container.querySelector('.table-light');
    expect(thead).toBeDefined();
  });

  test('should show "No products found" message with correct colspan', () => {
    const emptyContextValue = {
      ...mockContextValue,
      products: []
    };
    
    const { container } = renderWithContext(emptyContextValue);
    
    const noProductsCell = container.querySelector('td[colspan="6"]');
    expect(noProductsCell).toBeDefined();
    expect(noProductsCell?.className).toContain('text-center');
  });
});