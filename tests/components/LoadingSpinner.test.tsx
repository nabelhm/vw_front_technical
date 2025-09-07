import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('should render loading spinner', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeDefined();
  });

  test('should render loading text', () => {
    render(<LoadingSpinner />);

    expect(screen.getAllByText('Loading...')).toBeDefined();
  });

  test('should have accessible hidden text', () => {
    render(<LoadingSpinner />);

    const hiddenText = screen.getByText('Loading...', { selector: '.visually-hidden' });
    expect(hiddenText).toBeDefined();
  });

  test('should render within card body', () => {
    const { container } = render(<LoadingSpinner />);

    const cardBody = container.querySelector('.card-body');
    expect(cardBody).toBeDefined();
  });
});