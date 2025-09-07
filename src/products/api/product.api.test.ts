import { describe, expect, test } from 'vitest';
import { productApi } from './product.api';

const BASE_URL = 'http://localhost:3001';

describe('ProductApi', () => {
  test('should be configure pointing to the testing server', () => {
    expect(productApi).toBeDefined();
    expect(productApi.defaults.baseURL).toBe(`${BASE_URL}/products`);
    expect(BASE_URL).toContain('3001');
  });
});
