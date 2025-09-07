import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ErrorAlert } from '../../src/components/ErrorAlert';

describe('ErrorAlert Component', () => {
  test('should render error message', () => {
    render(<ErrorAlert error="Test error message" />);

    expect(screen.getByText('Test error message')).toBeDefined();
    expect(screen.getByText('Error:')).toBeDefined();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  test('should call onGoBack when button clicked', () => {
    const mockOnGoBack = vi.fn();
    render(<ErrorAlert error="Test error" onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText('Go Back'));
    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  test('should not render button when showBackButton is false', () => {
    const mockOnGoBack = vi.fn();
    render(
      <ErrorAlert 
        error="Test error" 
        onGoBack={mockOnGoBack} 
        showBackButton={false} 
      />
    );

    expect(screen.queryByText('Go Back')).toBe(null);
  });

  test('should not render button when onGoBack not provided', () => {
    render(<ErrorAlert error="Test error" />);

    expect(screen.queryByText('Go Back')).toBe(null);
  });
});