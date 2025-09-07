import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useContext } from 'react';
import { ProductsProvider } from '../../src/context/ProductsProvider';
import { ProductsContext } from '../../src/context/ProductsContext';

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
});