import type { Product, Category, Status, CreateProductData, UpdateProductData } from "../types/product.interface";

const mapStringToCategory = (categoryString: string): Category => {
  const validCategories: Category[] = ['Kitchen', 'Electronics', 'Garden', 'Construction', 'Sports', 'Clothing'];
  
  if (validCategories.includes(categoryString as Category)) {
    return categoryString as Category;
  }
  
  throw new Error(`Invalid category: ${categoryString}. Valid categories are: ${validCategories.join(', ')}`);
};

const mapStringToStatus = (statusString: string): Status => {
  if (statusString === 'active' || statusString === 'inactive') {
    return statusString as Status;
  }
  
  throw new Error(`Invalid status: ${statusString}. Valid statuses are: active, inactive`);
};

export const mapCreateProductDataToProduct = (
  productData: CreateProductData,
  id: string
): Product => {
  try {
    return {
      id,
      name: productData.name.trim(),
      category: mapStringToCategory(productData.category),
      price: Number(productData.price),
      stock: Number(productData.stock),
      description: productData.description.trim(),
      image: productData.image.trim(),
      status: mapStringToStatus(productData.status),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Error mapping product data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const mapUpdateProductDataToProduct = (
  productData: UpdateProductData,
  id: string,
  createdAt?: string
): Product => {
  try {
    return {
      id,
      name: productData.name.trim(),
      category: mapStringToCategory(productData.category),
      price: Number(productData.price),
      stock: Number(productData.stock),
      description: productData.description.trim(),
      image: productData.image.trim(),
      status: mapStringToStatus(productData.status),
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Error mapping update product data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const mapApiResponseToProduct = (apiData: Product): Product => {
  return {
    id: apiData.id,
    name: apiData.name,
    category: mapStringToCategory(apiData.category),
    price: Number(apiData.price),
    stock: Number(apiData.stock),
    description: apiData.description || '',
    image: apiData.image || '',
    status: mapStringToStatus(apiData.status),
    createdAt: apiData.createdAt || new Date().toISOString(),
    updatedAt: apiData.updatedAt || new Date().toISOString(),
  };
};

export const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};