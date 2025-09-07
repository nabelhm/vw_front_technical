import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateProductAction } from '../../src/actions/update-product-action';
import { productApi } from '../../src/api/product.api';
import { mapUpdateProductDataToProduct, } from '../../src/mappers/product.mapper';
import type { Product, UpdateProductData } from '../../src/types/product.interface';

vi.mock('../../src/api/product.api');
vi.mock('../../src/mappers/product.mapper');

const mockedProductApi = vi.mocked(productApi);
const mockedMapUpdateProductDataToProduct = vi.mocked(mapUpdateProductDataToProduct);

describe('updateProductAction', () => {
  const productId = 'existing_product_123';
  
  const mockUpdateProductData: UpdateProductData = {
    name: 'Updated Test Product',
    category: 'Kitchen',
    price: 149.99,
    stock: 75,
    description: 'Updated test description',
    image: 'https://example.com/updated-image.jpg',
    status: 'active'
  };

  const mockMappedProduct: Product = {
    id: productId,
    name: 'Updated Test Product',
    category: 'Kitchen',
    price: 149.99,
    stock: 75,
    description: 'Updated test description',
    image: 'https://example.com/updated-image.jpg',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  };

  const mockApiResponse: Product = {
    ...mockMappedProduct,
    updatedAt: '2024-01-02T10:30:00.000Z' // Simulate API updating the timestamp
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a product successfully', async () => {
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockResolvedValue({ data: mockApiResponse });

    const result = await updateProductAction(productId, mockUpdateProductData);

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      productId
    );
    expect(mockedProductApi.put).toHaveBeenCalledWith(`/${productId}`, mockMappedProduct);
    expect(result).toEqual(mockApiResponse);
  });

  it('should handle API errors', async () => {
    const apiError = new Error('Product not found');
    
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockRejectedValue(apiError);

    await expect(updateProductAction(productId, mockUpdateProductData))
      .rejects
      .toThrow('Product not found');

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      productId
    );
    expect(mockedProductApi.put).toHaveBeenCalledWith(`/${productId}`, mockMappedProduct);
  });

  it('should handle mapper errors', async () => {
    const mapperError = new Error('Invalid category: InvalidCategory');
    
    mockedMapUpdateProductDataToProduct.mockImplementation(() => {
      throw mapperError;
    });

    await expect(updateProductAction(productId, mockUpdateProductData))
      .rejects
      .toThrow('Invalid category: InvalidCategory');

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      productId
    );
    expect(mockedProductApi.put).not.toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    const networkError = { 
      code: 'NETWORK_ERROR',
      message: 'Network Error'
    };
    
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockRejectedValue(networkError);

    await expect(updateProductAction(productId, mockUpdateProductData))
      .rejects
      .toEqual(networkError);
  });

  it('should call functions in correct order', async () => {
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockResolvedValue({ data: mockApiResponse });

    await updateProductAction(productId, mockUpdateProductData);

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledTimes(1);
    expect(mockedProductApi.put).toHaveBeenCalledTimes(1);
  });

  it('should work with different product categories', async () => {

    const sportsProductData: UpdateProductData = {
      ...mockUpdateProductData,
      category: 'Sports'
    };

    const mappedSportsProduct: Product = {
      ...mockMappedProduct,
      category: 'Sports'
    };

    mockedMapUpdateProductDataToProduct.mockReturnValue(mappedSportsProduct);
    mockedProductApi.put.mockResolvedValue({ data: mappedSportsProduct });

    const result = await updateProductAction(productId, sportsProductData);

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      sportsProductData,
      productId
    );
    expect(result).toEqual(mappedSportsProduct);
  });

  it('should handle different product IDs', async () => {
    const differentProductId = 'different_product_456';
    
    mockedMapUpdateProductDataToProduct.mockReturnValue({
      ...mockMappedProduct,
      id: differentProductId
    });
    mockedProductApi.put.mockResolvedValue({ 
      data: { ...mockApiResponse, id: differentProductId }
    });

    const result = await updateProductAction(differentProductId, mockUpdateProductData);

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      differentProductId
    );
    expect(mockedProductApi.put).toHaveBeenCalledWith(`/${differentProductId}`, expect.any(Object));
    expect(result.id).toBe(differentProductId);
  });
});