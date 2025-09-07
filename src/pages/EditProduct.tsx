import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProductByIdAction } from '../actions/get-product-by-id-action';
import { ErrorAlert } from '../components/ErrorAlert';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NotFound } from '../components/NotFound';
import { ProductBackBar } from '../components/ProductBackBar';
import { ProductForm } from '../components/ProductForm';
import { useProductNavigation } from '../hooks/useProductNavigation';
import type { Product } from '../types/product.interface';

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { goToDashboard } = useProductNavigation();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const fetchedProduct = await getProductByIdAction(id);
        setProduct(fetchedProduct);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCancel = () => {
    goToDashboard();
  };

  if (isLoading) {
    return (
      <>
        <Header title="Edit Product" subtitle="Loading product information..." />
        <ProductBackBar />
        <LoadingSpinner />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Edit Product" subtitle="Error loading product" />
        <ProductBackBar />
        <ErrorAlert error={error} onGoBack={handleCancel} />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header title="Edit Product" subtitle="Product not found" />
        <ProductBackBar />
        <NotFound 
          title="Product Not Found"
          message="The product you're trying to edit doesn't exist or has been removed."
          onGoBack={handleCancel}
          buttonText="Back to Products"
        />
      </>
    );
  }

  return (
    <>
      <Header title={`Edit: ${product.name}`} subtitle="Update product information" />
      <ProductBackBar />
      <ProductForm
        isEdit={true}
        productId={product.id}
        initialData={product}
        onCancel={handleCancel}
      />
    </>
  );
};