import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Header } from '../../src/components/Header';

describe('Header Component', () => {
  test('should render title correctly', () => {
    render(<Header title="Test Title" />);
    
    const titleElement = screen.getByRole('heading', { level: 2 });
    expect(titleElement).toBeDefined();
    expect(titleElement.innerHTML).toContain('Test Title');
  });

  test('should render subtitle when provided', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" />);
    
    const subtitleElement = screen.getByRole('heading', { level: 3 });
    expect(subtitleElement).toBeDefined();
    expect(subtitleElement.innerHTML).toContain('Test Subtitle');
  });

  test('should not render subtitle when not provided', () => {
    render(<Header title="Test Title" />);
    
    const subtitleElement = screen.queryByRole('heading', { level: 3 });
    expect(subtitleElement).toBeNull();
  });

  test('should render with empty subtitle', () => {
    render(<Header title="Test Title" subtitle="" />);
    
    const subtitleElement = screen.queryByRole('heading', { level: 3 });
    expect(subtitleElement).toBeNull();
  });

});