import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createProductAction } from '../../src/actions/create-product-action';
import { productApi } from '../../src/api/product.api';
import { mapCreateProductDataToProduct, generateTempId } from '../../src/mappers/product.mapper';
import type { CreateProductData, Product } from '../../src/types/product.interface';

vi.mock('../../src/api/product.api');
vi.mock('../../src/mappers/product.mapper');

const mockedProductApi = productApi as { post: Mock };
const mockedMapCreateProductDataToProduct = mapCreateProductDataToProduct as Mock;
const mockedGenerateTempId = generateTempId as Mock;

describe('createProductAction', () => {
  const mockCreateProductData: CreateProductData = {
    name: 'Test Product',
    category: 'Electronics',
    price: 99.99,
    stock: 50,
    description: 'Test description',
    image: 'https://example.com/image.jpg',
    status: 'active'
  };

  const mockMappedProduct: Product = {
    id: 'temp_123',
    name: 'Test Product',
    category: 'Electronics',
    price: 99.99,
    stock: 50,
    description: 'Test description',
    image: 'https://example.com/image.jpg',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };

  const mockApiResponse: Product = {
    ...mockMappedProduct,
    id: 'real_api_id_456'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a product successfully', async () => {
    const tempId = 'temp_123';
    mockedGenerateTempId.mockReturnValue(tempId);
    mockedMapCreateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.post.mockResolvedValue({ data: mockApiResponse });

    const result = await createProductAction(mockCreateProductData);

    expect(mockedGenerateTempId).toHaveBeenCalledTimes(1);
    expect(mockedMapCreateProductDataToProduct).toHaveBeenCalledWith(
      mockCreateProductData,
      tempId
    );
    expect(mockedProductApi.post).toHaveBeenCalledWith('/', mockMappedProduct);
    expect(result).toEqual(mockApiResponse);
  });

  it('should handle API errors', async () => {
    const tempId = 'temp_123';
    const apiError = new Error('API Error');
    
    mockedGenerateTempId.mockReturnValue(tempId);
    mockedMapCreateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.post.mockRejectedValue(apiError);

    await expect(createProductAction(mockCreateProductData))
      .rejects
      .toThrow('API Error');

    expect(mockedGenerateTempId).toHaveBeenCalledTimes(1);
    expect(mockedMapCreateProductDataToProduct).toHaveBeenCalledWith(
      mockCreateProductData,
      tempId
    );
    expect(mockedProductApi.post).toHaveBeenCalledWith('/', mockMappedProduct);
  });

  it('should handle mapper errors', async () => {
    const tempId = 'temp_123';
    const mapperError = new Error('Invalid category: InvalidCategory');
    
    mockedGenerateTempId.mockReturnValue(tempId);
    mockedMapCreateProductDataToProduct.mockImplementation(() => {
      throw mapperError;
    });

    await expect(createProductAction(mockCreateProductData))
      .rejects
      .toThrow('Invalid category: InvalidCategory');

    expect(mockedGenerateTempId).toHaveBeenCalledTimes(1);
    expect(mockedMapCreateProductDataToProduct).toHaveBeenCalledWith(
      mockCreateProductData,
      tempId
    );
    expect(mockedProductApi.post).not.toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    const tempId = 'temp_123';
    const networkError = { 
      code: 'NETWORK_ERROR',
      message: 'Network Error'
    };
    
    mockedGenerateTempId.mockReturnValue(tempId);
    mockedMapCreateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.post.mockRejectedValue(networkError);

    await expect(createProductAction(mockCreateProductData))
      .rejects
      .toEqual(networkError);
  });

  it('should call functions in correct order', async () => {
    const tempId = 'temp_123';
    mockedGenerateTempId.mockReturnValue(tempId);
    mockedMapCreateProductDataToProduct.mockReturnValue(mockMappedProduct);
    mockedProductApi.post.mockResolvedValue({ data: mockApiResponse });

    await createProductAction(mockCreateProductData);

    expect(mockedGenerateTempId).toHaveBeenCalledTimes(1);
    expect(mockedMapCreateProductDataToProduct).toHaveBeenCalledTimes(1);
    expect(mockedProductApi.post).toHaveBeenCalledTimes(1);
  });

  it('should work with different product categories', async () => {
    const kitchenProductData: CreateProductData = {
      ...mockCreateProductData,
      category: 'Kitchen'
    };

    const mappedKitchenProduct: Product = {
      ...mockMappedProduct,
      category: 'Kitchen'
    };

    const tempId = 'temp_456';
    mockedGenerateTempId.mockReturnValue(tempId);
    mockedMapCreateProductDataToProduct.mockReturnValue(mappedKitchenProduct);
    mockedProductApi.post.mockResolvedValue({ data: mappedKitchenProduct });

    const result = await createProductAction(kitchenProductData);

    expect(mockedMapCreateProductDataToProduct).toHaveBeenCalledWith(
      kitchenProductData,
      tempId
    );
    expect(result).toEqual(mappedKitchenProduct);
  });
});