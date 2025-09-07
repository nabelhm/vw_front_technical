import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ProductDetail } from '../../src/pages/ProductDetail';
import type { Product } from '../../src/types/product.interface';

const { mockGoToDashboard, mockGoToEditProduct, mockGetProductByIdAction } = vi.hoisted(() => ({
  mockGoToDashboard: vi.fn(),
  mockGoToEditProduct: vi.fn(),
  mockGetProductByIdAction: vi.fn(),
}));

vi.mock('../../src/hooks/useProductNavigation', () => ({
  useProductNavigation: () => ({
    goToDashboard: mockGoToDashboard,
    goToEditProduct: mockGoToEditProduct,
    goToDashboardWithMessage: vi.fn(),
    goToViewProduct: vi.fn(),
    goToAddProduct: vi.fn(),
    goBack: vi.fn(),
    goTo: vi.fn(),
    redirectTo: vi.fn(),
  })
}));

vi.mock('../../src/actions/get-product-by-id-action', () => ({
  getProductByIdAction: mockGetProductByIdAction
}));

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

const renderProductDetail = (productId = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProductDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should show loading state initially', () => {
    mockGetProductByIdAction.mockImplementation(() => new Promise(() => {}));
    
    renderProductDetail();

    expect(screen.getByText('Product Details')).toBeDefined();
    expect(screen.getByText('Loading product information...')).toBeDefined();
    expect(screen.getAllByText('Loading...')).toBeDefined();
  });

  test('should render product details when product loads successfully', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderProductDetail();

    await waitFor(() => {
      expect(screen.getAllByText('Test Product')).toBeDefined();
    });

    expect(screen.getByText('Product details and information')).toBeDefined();
    expect(screen.getByText('Edit Product')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
  });

  test('should call getProductByIdAction with correct ID', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderProductDetail('123');

    await waitFor(() => {
      expect(mockGetProductByIdAction).toHaveBeenCalledWith('123');
    });
  });

  test('should show error when product fetch fails', async () => {
    mockGetProductByIdAction.mockRejectedValue(new Error('Failed to load'));

    renderProductDetail();

    await waitFor(() => {
      expect(screen.getByText('Error loading product')).toBeDefined();
    });
  });

  test('should show not found when product is null', async () => {
    mockGetProductByIdAction.mockResolvedValue(null);

    renderProductDetail();

    await waitFor(() => {
      expect(screen.getByText('Product Not Found')).toBeDefined();
      expect(screen.getByText("The product you're looking for doesn't exist or has been removed.")).toBeDefined();
    });
  });


  test('should call goToDashboard when back button is clicked', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderProductDetail();

    await waitFor(() => {
      expect(screen.getByText('Back to Products')).toBeDefined();
    });

    const backButton = screen.getByText('Back to Products');
    fireEvent.click(backButton);

    expect(mockGoToDashboard).toHaveBeenCalledTimes(1);
  });

  test('should call goToDashboard when cancel button is clicked', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderProductDetail();

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeDefined();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockGoToDashboard).toHaveBeenCalledTimes(1);
  });

  test('should call goToEditProduct when edit button is clicked', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderProductDetail();

    await waitFor(() => {
      expect(screen.getByText('Edit Product')).toBeDefined();
    });

    const editButton = screen.getByText('Edit Product');
    fireEvent.click(editButton);

    expect(mockGoToEditProduct).toHaveBeenCalledTimes(1);
    expect(mockGoToEditProduct).toHaveBeenCalledWith('1');
  });

  test('should render with accessible structure', async () => {
    mockGetProductByIdAction.mockResolvedValue(mockProduct);

    renderProductDetail();

    await waitFor(() => {
      expect(screen.getAllByText('Test Product')).toBeDefined();
    });

    const mainHeading = screen.getAllByRole('heading', { level: 2 })[0];
    expect(mainHeading).toBeDefined();
    expect(mainHeading.textContent).toBe('Test Product');

    const backButton = screen.getByRole('button', { name: /back to products/i });
    expect(backButton).toBeDefined();
  });
});