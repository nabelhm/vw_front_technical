import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useRouteMessage } from '../../src/hooks/useRouteMessage';

const mockUseLocation = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

describe('useRouteMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  test('should return initial state when no message in location', () => {
    mockUseLocation.mockReturnValue({ state: null });

    const { result } = renderHook(() => useRouteMessage(), { wrapper });

    expect(result.current.message).toBe(null);
    expect(result.current.type).toBe('success');
    expect(typeof result.current.clearMessage).toBe('function');
  });

  test('should extract message and type from location state', () => {
    mockUseLocation.mockReturnValue({
      state: { message: 'Test message', type: 'error' }
    });

    const { result } = renderHook(() => useRouteMessage(), { wrapper });

    expect(result.current.message).toBe('Test message');
    expect(result.current.type).toBe('error');
  });

  test('should default to success type when type not provided', () => {
    mockUseLocation.mockReturnValue({
      state: { message: 'Test message' }
    });

    const { result } = renderHook(() => useRouteMessage(), { wrapper });

    expect(result.current.message).toBe('Test message');
    expect(result.current.type).toBe('success');
  });

  test('should clear message when clearMessage is called', () => {
    mockUseLocation.mockReturnValue({
      state: { message: 'Test message', type: 'warning' }
    });

    const { result } = renderHook(() => useRouteMessage(), { wrapper });

    expect(result.current.message).toBe('Test message');

    act(() => {
      result.current.clearMessage();
    });

    expect(result.current.message).toBe(null);
    expect(result.current.type).toBe('warning');
  });

  test('should update when location state changes', () => {
    const { result, rerender } = renderHook(() => useRouteMessage(), { wrapper });

    mockUseLocation.mockReturnValue({
      state: { message: 'First message', type: 'success' }
    });

    rerender();

    expect(result.current.message).toBe('First message');
    expect(result.current.type).toBe('success');

    mockUseLocation.mockReturnValue({
      state: { message: 'Second message', type: 'error' }
    });

    rerender();

    expect(result.current.message).toBe('Second message');
    expect(result.current.type).toBe('error');
  });

  test('should handle all message types', () => {
    const types = ['success', 'error', 'info', 'warning'] as const;

    types.forEach(type => {
      mockUseLocation.mockReturnValue({
        state: { message: `${type} message`, type }
      });

      const { result } = renderHook(() => useRouteMessage(), { wrapper });

      expect(result.current.message).toBe(`${type} message`);
      expect(result.current.type).toBe(type);
    });
  });

  test('should handle undefined state', () => {
    mockUseLocation.mockReturnValue({ state: undefined });

    const { result } = renderHook(() => useRouteMessage(), { wrapper });

    expect(result.current.message).toBe(null);
    expect(result.current.type).toBe('success');
  });
});