import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ProductActionsBar } from '../../src/components/ProductActionsBar';

vi.mock('../../src/components/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar Mock</div>
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProductActionsBar Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <ProductActionsBar />
      </MemoryRouter>
    );
  };

  test('should render Products title correctly', () => {
    renderWithRouter();
    
    const titleElement = screen.getByRole('heading', { level: 2 });
    expect(titleElement).toBeDefined();
    expect(titleElement.innerHTML).toContain('Products');
  });

  test('should render SearchBar component', () => {
    renderWithRouter();
    
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeDefined();
  });

  test('should render Add Product button', () => {
    renderWithRouter();
    
    const addButton = screen.getByRole('button', { name: /add product/i });
    expect(addButton).toBeDefined();
  });

  test('should navigate to add-product when button is clicked', () => {
    renderWithRouter();
    
    const addButton = screen.getByRole('button', { name: /add product/i });
    fireEvent.click(addButton);
    
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/add-product');
  });
});