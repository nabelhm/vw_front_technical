import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { NotFound } from '../../src/components/NotFound';

describe('NotFound Component', () => {
  test('should render default title and message', () => {
    render(<NotFound />);

    expect(screen.getByText('Product Not Found')).toBeDefined();
    expect(screen.getByText("The product you're looking for doesn't exist or has been removed.")).toBeDefined();
  });

  test('should render custom title and message', () => {
    render(
      <NotFound 
        title="Custom Title" 
        message="Custom message here" 
      />
    );

    expect(screen.getByText('Custom Title')).toBeDefined();
    expect(screen.getByText('Custom message here')).toBeDefined();
  });

  test('should call onGoBack when button clicked', () => {
    const mockOnGoBack = vi.fn();
    render(<NotFound onGoBack={mockOnGoBack} />);

    fireEvent.click(screen.getByText('Go Back to Products'));
    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  test('should not render button when onGoBack not provided', () => {
    render(<NotFound />);

    expect(screen.queryByRole('button')).toBe(null);
  });

  test('should render custom button text', () => {
    const mockOnGoBack = vi.fn();
    render(
      <NotFound 
        onGoBack={mockOnGoBack} 
        buttonText="Custom Button" 
      />
    );

    expect(screen.getByText('Custom Button')).toBeDefined();
  });
});