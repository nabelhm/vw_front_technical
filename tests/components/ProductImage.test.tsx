import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ProductImage } from '../../src/components/ProductImage';

describe('ProductImage Component', () => {
  test('should render image when image prop is provided', () => {
    render(
      <ProductImage 
        image="https://example.com/test-image.jpg" 
        name="Test Product" 
      />
    );

    const image = screen.getByRole('img');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe('https://example.com/test-image.jpg');
    expect(image.getAttribute('alt')).toBe('Test Product');
  });

  test('should render placeholder when no image prop provided', () => {
    render(<ProductImage name="Test Product" />);

    expect(screen.queryByRole('img')).toBe(null);
    expect(screen.getByText('No Image Available')).toBeDefined();
    const icon = document.querySelector('.bi-image');
    expect(icon).toBeDefined();
  });

  test('should be accessible', () => {
    render(
      <ProductImage 
        image="https://example.com/test-image.jpg" 
        name="Accessible Product" 
      />
    );

    const image = screen.getByRole('img');
    expect(image.getAttribute('alt')).toBe('Accessible Product');
  });
});