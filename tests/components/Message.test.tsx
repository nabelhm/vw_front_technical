import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { Message } from '../../src/components/Message';

describe('Message Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should not render when no message provided', () => {
    const { container } = render(<Message />);
    expect(container.firstChild).toBe(null);
  });

  test('should not render when message is null', () => {
    const { container } = render(<Message message={null} />);
    expect(container.firstChild).toBe(null);
  });

  test('should not render when message is empty string', () => {
    const { container } = render(<Message message="" />);
    expect(container.firstChild).toBe(null);
  });

  test('should render success message by default', () => {
    render(<Message message="Success message" />);
    
    expect(screen.getByText('Success message')).toBeDefined();
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByRole('alert').className).toContain('alert-success');
    expect(screen.getByRole('alert')).toContain(screen.getByText('Success message'));
  });

  test('should render error message with correct styling', () => {
    render(<Message message="Error message" type="error" />);
    
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('alert-danger');
    expect(screen.getByText('Error message')).toBeDefined();
  });

  test('should render warning message with correct styling', () => {
    render(<Message message="Warning message" type="warning" />);
    
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('alert-warning');
    expect(screen.getByText('Warning message')).toBeDefined();
  });

  test('should render info message with correct styling', () => {
    render(<Message message="Info message" type="info" />);
    
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('alert-info');
    expect(screen.getByText('Info message')).toBeDefined();
  });

  test('should call onDismiss when close button is clicked', () => {
    const mockOnDismiss = vi.fn();
    render(<Message message="Test message" onDismiss={mockOnDismiss} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  test('should not auto-close when autoClose is false', () => {
    const mockOnDismiss = vi.fn();
    render(<Message message="Test message" onDismiss={mockOnDismiss} autoClose={false} />);
    
    vi.advanceTimersByTime(10000);
    
    expect(mockOnDismiss).not.toHaveBeenCalled();
    expect(screen.getByText('Test message')).toBeDefined();
  });

  test('should hide when message changes to null', () => {
    const { rerender } = render(<Message message="Initial message" />);
    
    expect(screen.getByText('Initial message')).toBeDefined();
    
    rerender(<Message message={null} />);
    
    expect(screen.queryByText('Initial message')).toBe(null);
  });

  test('should update message when prop changes', () => {
    const { rerender } = render(<Message message="First message" />);
    
    expect(screen.getByText('First message')).toBeDefined();
    
    rerender(<Message message="Second message" />);
    
    expect(screen.getByText('Second message')).toBeDefined();
    expect(screen.queryByText('First message')).toBe(null);
  });

  test('should clear timer when component unmounts', () => {
    const mockOnDismiss = vi.fn();
    const { unmount } = render(
      <Message message="Test message" onDismiss={mockOnDismiss} />
    );
    
    unmount();
    vi.advanceTimersByTime(5000);
    
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  test('should have correct accessibility attributes', () => {
    render(<Message message="Accessible message" />);
    
    const alert = screen.getByRole('alert');
    const closeButton = screen.getByLabelText('Close');
    
    expect(alert).toBeDefined();
    expect(closeButton).toBeDefined();
    expect(closeButton.getAttribute('aria-label')).toBe('Close');
  });

  test('should handle rapid message changes', () => {
    const mockOnDismiss = vi.fn();
    const { rerender } = render(
      <Message message="Message 1" onDismiss={mockOnDismiss} />
    );
    
    rerender(<Message message="Message 2" onDismiss={mockOnDismiss} />);
    rerender(<Message message="Message 3" onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Message 3')).toBeDefined();
    expect(screen.queryByText('Message 1')).toBe(null);
    expect(screen.queryByText('Message 2')).toBe(null);
  });

  test('should work without onDismiss callback', () => {
    render(<Message message="Test message" />);
    
    const closeButton = screen.getByLabelText('Close');
    
    expect(() => fireEvent.click(closeButton)).not.toThrow();
  });
});