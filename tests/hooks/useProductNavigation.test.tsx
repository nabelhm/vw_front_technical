import { renderHook } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useProductNavigation } from '../../src/hooks/useProductNavigation';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useProductNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  test('should return all navigation functions', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    expect(typeof result.current.goToAddProduct).toBe('function');
    expect(typeof result.current.goToEditProduct).toBe('function');
    expect(typeof result.current.goToViewProduct).toBe('function');
    expect(typeof result.current.goToDashboard).toBe('function');
    expect(typeof result.current.goToDashboardWithMessage).toBe('function');
    expect(typeof result.current.goBack).toBe('function');
    expect(typeof result.current.goTo).toBe('function');
    expect(typeof result.current.redirectTo).toBe('function');
  });

  test('should navigate to add product page', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goToAddProduct();

    expect(mockNavigate).toHaveBeenCalledWith('/add-product');
  });

  test('should navigate to edit product page with id', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goToEditProduct('123');

    expect(mockNavigate).toHaveBeenCalledWith('/edit-product/123');
  });

  test('should navigate to view product page with id', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goToViewProduct('456');

    expect(mockNavigate).toHaveBeenCalledWith('/product/456');
  });

  test('should navigate to dashboard', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goToDashboard();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('should navigate to dashboard with success message', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goToDashboardWithMessage('Product created successfully!');

    expect(mockNavigate).toHaveBeenCalledWith('/', {
      state: { message: 'Product created successfully!', type: 'success' }
    });
  });

  test('should navigate to dashboard with error message', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goToDashboardWithMessage('Something went wrong', 'error');

    expect(mockNavigate).toHaveBeenCalledWith('/', {
      state: { message: 'Something went wrong', type: 'error' }
    });
  });

  test('should go back in history', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goBack();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('should navigate to custom path', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.goTo('/custom-path');

    expect(mockNavigate).toHaveBeenCalledWith('/custom-path');
  });

  test('should redirect to path with replace option', () => {
    const { result } = renderHook(() => useProductNavigation(), { wrapper });

    result.current.redirectTo('/redirect-path');

    expect(mockNavigate).toHaveBeenCalledWith('/redirect-path', { replace: true });
  });
});