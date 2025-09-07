import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProductByIdAction } from '../actions/get-product-by-id-action';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProductBackBar } from '../components/ProductBackBar';
import { ProductImage } from '../components/ProductImage';
import { ProductInfo } from '../components/ProductInfo';
import { ProductActions } from '../components/ProductActions';
import { ErrorAlert } from '../components/ErrorAlert';
import { NotFound } from '../components/NotFound';
import { useProductNavigation } from '../hooks/useProductNavigation';
import type { Product } from '../types/product.interface';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { goToDashboard, goToEditProduct } = useProductNavigation();
  
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

  const handleEdit = () => {
    if (product) {
      goToEditProduct(product.id);
    }
  };

  const handleBack = () => {
    goToDashboard();
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header title="Product Details" subtitle="Loading product information..." />
        <ProductBackBar />
        <LoadingSpinner />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header title="Product Details" subtitle="Error loading product" />
        <ProductBackBar />
        <ErrorAlert error={error} onGoBack={handleBack} />
      </>
    );
  }

  // Product not found
  if (!product) {
    return (
      <>
        <Header title="Product Details" subtitle="Product not found" />
        <ProductBackBar />
        <NotFound onGoBack={handleBack} />
      </>
    );
  }

  // Success state - show product details
  return (
    <>
      <Header title={product.name} subtitle="Product details and information" />
      <ProductBackBar />

      <div className="card-body">
        <div className="row">
          <ProductImage image={product.image} name={product.name} />
          <ProductInfo product={product} />
        </div>
        
        <ProductActions onEdit={handleEdit} onCancel={handleBack} />
      </div>
    </>
  );
};