import { describe, expect, test } from 'vitest';
import { productApi } from '../../../src/products/api/product.api';

describe('ProductApi', () => {
  test('should be configure pointing to the testing server', () => {
    expect(productApi).toBeDefined();
    expect(productApi.defaults.baseURL).toBe('http://localhost:3001/products');
  });
});
