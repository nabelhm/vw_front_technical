import { fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ProductsContext } from '../../src/context/ProductsContext';
import { ProductsProvider } from '../../src/context/ProductsProvider';

vi.mock('../../src/hooks/useProducts', () => ({
  useProducts: vi.fn(() => ({
    products: [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        stock: 25,
        description: "High-quality wireless headphones with noise cancellation.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        status: "active",
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
      {
        id: "2",
        name: "Organic Cotton T-Shirt",
        category: "Clothing",
        price: 24.99,
        stock: 50,
        description: "Comfortable and sustainable organic cotton t-shirt.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        status: "active",
        createdAt: "2024-01-14T09:30:00.000Z",
        updatedAt: "2024-01-14T09:30:00.000Z",
      },
      {
        id: "3",
        name: "Smart Home Security Camera",
        category: "Electronics",
        price: 149.99,
        stock: 8,
        description: "1080p HD security camera with night vision.",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400",
        status: "active",
        createdAt: "2024-01-13T14:20:00.000Z",
        updatedAt: "2024-01-13T14:20:00.000Z",
      },
    ],
    isLoading: false,
    isInitialLoading: false,
    error: null,
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    refetchProducts: vi.fn(),
    setError: vi.fn(),
  }))
}));

vi.unmock('../../src/hooks/useFilters');
vi.unmock('../../src/hooks/useSort');

const IntegrationTestComponent = () => {
  const {
    products,
    searchTerm,
    setSearchTerm,
    sortField,
    sortOrder,
    handleSort
  } = useContext(ProductsContext);

  return (
    <div>
      <div data-testid="total-products">{products.length}</div>
      
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      
      <div data-testid="current-sort">{sortField}-{sortOrder}</div>
      
      <button 
        data-testid="sort-name"
        onClick={() => handleSort('name')}
      >
        Sort by Name
      </button>
      
      <button 
        data-testid="sort-price"
        onClick={() => handleSort('price')}
      >
        Sort by Price
      </button>
      
      <div data-testid="products-list">
        {products.map((product, index) => (
          <div key={product.id} data-testid={`product-${index}`}>
            {product.name} - ${product.price} - {product.category}
          </div>
        ))}
      </div>
    </div>
  );
};

describe('ProductsProvider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should display all mock products initially', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    expect(screen.getByTestId('total-products').innerHTML).toBe('3');
    expect(screen.getByTestId('current-sort').innerHTML).toBe('name-asc');
    
    expect(screen.getByTestId('product-0').innerHTML).toContain('Organic Cotton T-Shirt');
    expect(screen.getByTestId('product-1').innerHTML).toContain('Smart Home Security Camera');
    expect(screen.getByTestId('product-2').innerHTML).toContain('Wireless Bluetooth Headphones');
  });

  test('should filter products when searching', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: 'wireless' } });
    
    expect(screen.getByTestId('total-products').innerHTML).toBe('1');
    expect(screen.getByTestId('product-0').innerHTML).toContain('Wireless Bluetooth Headphones');
  });

  test('should filter products by category', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: 'Electronics' } });
    
    expect(screen.getByTestId('total-products').innerHTML).toBe('2');
    expect(screen.getByTestId('product-0').innerHTML).toContain('Smart Home Security Camera');
    expect(screen.getByTestId('product-1').innerHTML).toContain('Wireless Bluetooth Headphones');
  });

  test('should sort products by price when clicking sort button', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    const sortPriceButton = screen.getByTestId('sort-price');
    
    fireEvent.click(sortPriceButton);
    
    expect(screen.getByTestId('current-sort').innerHTML).toBe('price-asc');

    expect(screen.getByTestId('product-0').innerHTML).toContain('24.99');
    expect(screen.getByTestId('product-1').innerHTML).toContain('79.99');
    expect(screen.getByTestId('product-2').innerHTML).toContain('149.99');
  });

  test('should toggle sort order when clicking same field twice', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    const sortNameButton = screen.getByTestId('sort-name');
    
    fireEvent.click(sortNameButton);
    
    expect(screen.getByTestId('current-sort').innerHTML).toBe('name-desc');
    expect(screen.getByTestId('product-0').innerHTML).toContain('Wireless Bluetooth Headphones');
    expect(screen.getByTestId('product-2').innerHTML).toContain('Organic Cotton T-Shirt');
  });

  test('should filter and sort together correctly', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    const searchInput = screen.getByTestId('search-input');
    const sortPriceButton = screen.getByTestId('sort-price');
    
    fireEvent.change(searchInput, { target: { value: 'Electronics' } });
    
    expect(screen.getByTestId('total-products').innerHTML).toBe('2');
    
    fireEvent.click(sortPriceButton);
    
    expect(screen.getByTestId('current-sort').innerHTML).toBe('price-asc');
    expect(screen.getByTestId('product-0').innerHTML).toContain('79.99');
    expect(screen.getByTestId('product-1').innerHTML).toContain('149.99');
  });

  test('should show no results when search has no matches', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByTestId('total-products').innerHTML).toBe('0');
  });

  test('should clear search and show all products', () => {
    render(
      <ProductsProvider>
        <IntegrationTestComponent />
      </ProductsProvider>
    );

    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: 'wireless' } });
    expect(screen.getByTestId('total-products').innerHTML).toBe('1');
    
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByTestId('total-products').innerHTML).toBe('3');
  });
});