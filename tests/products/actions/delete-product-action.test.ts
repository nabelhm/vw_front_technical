import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteProductAction } from '../../../src/products/actions/delete-product-action';
import { productApi } from '../../../src/products/api/product.api';

vi.mock('../../../src/products/api/product.api');

const mockedProductApi = vi.mocked(productApi);

describe('deleteProductAction', () => {
  const productId = 'product_to_delete_123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a product successfully', async () => {
    mockedProductApi.delete.mockResolvedValue({ data: undefined });

    await deleteProductAction(productId);

    expect(mockedProductApi.delete).toHaveBeenCalledWith(`/${productId}`);
    expect(mockedProductApi.delete).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors when product not found', async () => {

    const notFoundError = new Error('Product not found');
    mockedProductApi.delete.mockRejectedValue(notFoundError);

    await expect(deleteProductAction(productId))
      .rejects
      .toThrow('Product not found');

    expect(mockedProductApi.delete).toHaveBeenCalledWith(`/${productId}`);
  });

  it('should handle network errors', async () => {

    const networkError = { 
      code: 'NETWORK_ERROR',
      message: 'Network Error'
    };
    mockedProductApi.delete.mockRejectedValue(networkError);

    await expect(deleteProductAction(productId))
      .rejects
      .toEqual(networkError);
  });

  it('should handle API server errors', async () => {
    const serverError = new Error('Internal Server Error');
    mockedProductApi.delete.mockRejectedValue(serverError);

    await expect(deleteProductAction(productId))
      .rejects
      .toThrow('Internal Server Error');

    expect(mockedProductApi.delete).toHaveBeenCalledWith(`/${productId}`);
  });

  it('should work with different product IDs', async () => {
    const differentIds = ['product_1', 'product_2', 'product_3'];
    
    for (const id of differentIds) {
      mockedProductApi.delete.mockResolvedValue({ data: undefined });

      await deleteProductAction(id);
      expect(mockedProductApi.delete).toHaveBeenCalledWith(`/${id}`);
    }

    expect(mockedProductApi.delete).toHaveBeenCalledTimes(differentIds.length);
  });

  it('should handle empty or invalid product IDs', async () => {
    const emptyId = '';
    mockedProductApi.delete.mockResolvedValue({ data: undefined });

    await deleteProductAction(emptyId);

    expect(mockedProductApi.delete).toHaveBeenCalledWith('/');
  });

  it('should not return any data on successful deletion', async () => {
    mockedProductApi.delete.mockResolvedValue({ data: undefined });

    const result = await deleteProductAction(productId);

    expect(result).toBeUndefined();
  });
});