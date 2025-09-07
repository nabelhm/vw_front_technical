import { describe, expect, test } from 'vitest';
import { productApi } from '../../src/api/product.api';

describe('ProductApi', () => {
  test('should be configure pointing to the testing server', () => {
    expect(productApi).toBeDefined();
    expect(productApi.defaults.baseURL).toBe('http://localhost:3001/products');
  });
});
