import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateProductAction } from '../../src/actions/update-product-action';
import { productApi } from '../../src/api/product.api';
import { mapUpdateProductDataToProduct } from '../../src/mappers/product.mapper';
import { getProductByIdAction } from '../../src/actions/get-product-by-id-action';
import type { Product, UpdateProductData } from '../../src/types/product.interface';

vi.mock('../../src/api/product.api');
vi.mock('../../src/mappers/product.mapper');
vi.mock('../../src/actions/get-product-by-id-action');

const mockedProductApi = vi.mocked(productApi);
const mockedMapUpdateProductDataToProduct = vi.mocked(mapUpdateProductDataToProduct);
const mockedGetProductByIdAction = vi.mocked(getProductByIdAction);

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

  const mockCurrentProduct: Product = {
    id: productId,
    name: 'Original Product',
    category: 'Electronics',
    price: 99.99,
    stock: 50,
    description: 'Original description',
    image: 'https://example.com/original-image.jpg',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T12:00:00.000Z'
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
    updatedAt: '2024-01-02T10:30:00.000Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a product successfully', async () => {
    mockedGetProductByIdAction.mockResolvedValue(mockCurrentProduct);
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockResolvedValue({ data: mockApiResponse });

    const result = await updateProductAction(productId, mockUpdateProductData);

    expect(mockedGetProductByIdAction).toHaveBeenCalledWith(productId);
    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      productId,
      mockCurrentProduct.createdAt
    );
    expect(mockedProductApi.put).toHaveBeenCalledWith(`/${productId}`, mockMappedProduct);
    expect(result).toEqual(mockApiResponse);
  });

  it('should handle API errors', async () => {
    const apiError = new Error('Product not found');
    
    mockedGetProductByIdAction.mockResolvedValue(mockCurrentProduct);
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockRejectedValue(apiError);

    await expect(updateProductAction(productId, mockUpdateProductData))
      .rejects
      .toThrow('Product not found');

    expect(mockedGetProductByIdAction).toHaveBeenCalledWith(productId);
    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      productId,
      mockCurrentProduct.createdAt
    );
    expect(mockedProductApi.put).toHaveBeenCalledWith(`/${productId}`, mockMappedProduct);
  });

  it('should handle get product errors', async () => {
    const getError = new Error('Product not found for update');
    
    mockedGetProductByIdAction.mockRejectedValue(getError);

    await expect(updateProductAction(productId, mockUpdateProductData))
      .rejects
      .toThrow('Product not found for update');

    expect(mockedGetProductByIdAction).toHaveBeenCalledWith(productId);
    expect(mockedMapUpdateProductDataToProduct).not.toHaveBeenCalled();
    expect(mockedProductApi.put).not.toHaveBeenCalled();
  });

  it('should handle mapper errors', async () => {
    const mapperError = new Error('Invalid category: InvalidCategory');
    
    mockedGetProductByIdAction.mockResolvedValue(mockCurrentProduct);
    mockedMapUpdateProductDataToProduct.mockImplementation(() => {
      throw mapperError;
    });

    await expect(updateProductAction(productId, mockUpdateProductData))
      .rejects
      .toThrow('Invalid category: InvalidCategory');

    expect(mockedGetProductByIdAction).toHaveBeenCalledWith(productId);
    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      productId,
      mockCurrentProduct.createdAt
    );
    expect(mockedProductApi.put).not.toHaveBeenCalled();
  });

  it('should preserve original createdAt date', async () => {
    const originalCreatedAt = '2023-12-01T10:00:00.000Z';
    const productWithOldDate: Product = {
      ...mockCurrentProduct,
      createdAt: originalCreatedAt
    };

    mockedGetProductByIdAction.mockResolvedValue(productWithOldDate);
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockResolvedValue({ data: mockApiResponse });

    await updateProductAction(productId, mockUpdateProductData);

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      mockUpdateProductData,
      productId,
      originalCreatedAt
    );
  });

  it('should call functions in correct order', async () => {
    mockedGetProductByIdAction.mockResolvedValue(mockCurrentProduct);
    mockedMapUpdateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.put.mockResolvedValue({ data: mockApiResponse });

    await updateProductAction(productId, mockUpdateProductData);

    const callOrder = [
      mockedGetProductByIdAction.mock.invocationCallOrder[0],
      mockedMapUpdateProductDataToProduct.mock.invocationCallOrder[0],
      mockedProductApi.put.mock.invocationCallOrder[0]
    ];

    expect(callOrder[0]).toBeLessThan(callOrder[1]);
    expect(callOrder[1]).toBeLessThan(callOrder[2]);
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

    mockedGetProductByIdAction.mockResolvedValue(mockCurrentProduct);
    mockedMapUpdateProductDataToProduct.mockReturnValue(mappedSportsProduct);
    mockedProductApi.put.mockResolvedValue({ data: mappedSportsProduct });

    const result = await updateProductAction(productId, sportsProductData);

    expect(mockedMapUpdateProductDataToProduct).toHaveBeenCalledWith(
      sportsProductData,
      productId,
      mockCurrentProduct.createdAt
    );
    expect(result).toEqual(mappedSportsProduct);
  });
});