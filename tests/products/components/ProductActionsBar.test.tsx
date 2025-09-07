import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ProductActionsBar } from '../../../src/products/components/ProductActionsBar';
import { ProductsContext } from '../../../src/products/context/ProductsContext';

vi.mock('../../../src/products/components/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar Mock</div>
}));

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

describe('ProductActionsBar Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <ProductsContext.Provider value={contextValue}>
        <ProductActionsBar />
      </ProductsContext.Provider>
    );
  };

  test('should render Products title correctly', () => {
    renderWithContext();
    
    const titleElement = screen.getByRole('heading', { level: 2 });
    expect(titleElement).toBeDefined();
    expect(titleElement.innerHTML).toContain('Products');
    expect(titleElement.className).toContain('h4');
    expect(titleElement.className).toContain('mb-0');
  });

  test('should render SearchBar component', () => {
    renderWithContext();
    
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeDefined();
  });

  test('should render Add Product button', () => {
    renderWithContext();
    
    const addButton = screen.getByRole('button', { name: /add product/i });
    expect(addButton).toBeDefined();
  });

  test('should call handleAddProduct when Add Product button is clicked', () => {
    renderWithContext();
    
    const addButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(addButton);
    
    expect(mockContextValue.handleAddProduct).toHaveBeenCalledTimes(1);
  });

});