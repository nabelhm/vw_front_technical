import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { SearchBar } from '../../src/components/SearchBar';
import { ProductsContext } from '../../src/context/ProductsContext';

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

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <ProductsContext.Provider value={contextValue}>
        <SearchBar />
      </ProductsContext.Provider>
    );
  };

  test('should render input with correct placeholder', () => {
    renderWithContext();
    
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeDefined();
    expect(input.className).toContain('form-control');
    expect(input.className).toContain('border-start-0');
  });

  test('should render search icon', () => {
    const { container } = renderWithContext();
    
    const icon = container.querySelector('.bi-search');
    expect(icon).toBeDefined();
    
    const iconContainer = container.querySelector('.input-group-text');
    expect(iconContainer).toBeDefined();
    expect(iconContainer?.className).toContain('bg-transparent');
    expect(iconContainer?.className).toContain('border-end-0');
  });

  test('should display current searchTerm value', () => {
    const contextWithSearchTerm = {
      ...mockContextValue,
      searchTerm: 'test search'
    };
    
    renderWithContext(contextWithSearchTerm);
    
    const input = screen.getByDisplayValue('test search');
    expect(input).toBeDefined();
  });

  test('should call setSearchTerm when input value changes', () => {
    renderWithContext();
    
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'new search' } });
    
    expect(mockContextValue.setSearchTerm).toHaveBeenCalledWith('new search');
  });

  test('should clear input when searchTerm is empty', () => {
    renderWithContext();
    
    const input = screen.getByPlaceholderText('Search products...');
    expect(input.getAttribute('value')).toBe('');
  });
});