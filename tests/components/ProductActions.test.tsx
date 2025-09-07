import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ProductActions } from '../../src/components/ProductActions';

describe('ProductActions Component', () => {
  test('should render both action buttons', () => {
    const mockOnEdit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ProductActions onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Cancel')).toBeDefined();
    expect(screen.getByText('Edit Product')).toBeDefined();
  });

  test('should call onCancel when cancel button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ProductActions onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  test('should call onEdit when edit button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ProductActions onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    const editButton = screen.getByText('Edit Product');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  test('should have correct button styles', () => {
    const mockOnEdit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ProductActions onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    const editButton = screen.getByText('Edit Product');

    expect(cancelButton.className).toContain('btn');
    expect(cancelButton.className).toContain('btn-secondary');

    expect(editButton.className).toContain('btn');
    expect(editButton.className).toContain('btn-success');
  });

  test('should be accessible with proper button roles', () => {
    const mockOnEdit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ProductActions onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const editButton = screen.getByRole('button', { name: /edit product/i });

    expect(cancelButton).toBeDefined();
    expect(editButton).toBeDefined();
  });
});