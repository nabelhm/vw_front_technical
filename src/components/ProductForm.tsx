import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useProductNavigation } from '../hooks/useProductNavigation';
import { ProductsContext } from '../context/ProductsContext';
import type { CreateProductData, UpdateProductData } from '../mappers/product.mapper';
import type { Category, Status } from '../types/product.interface';

interface ProductFormProps {
  onCancel?: () => void;
  isEdit?: boolean;
  initialData?: Partial<CreateProductData>;
  productId?: string; // Para modo edición
}

export const ProductForm = ({ 
  onCancel, 
  isEdit = false, 
  initialData,
  productId 
}: ProductFormProps) => {
  const { goToDashboardWithMessage, goToDashboard } = useProductNavigation();
  const { createProduct, updateProduct, isLoading, setError } = useContext(ProductsContext);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<CreateProductData>({
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      description: initialData?.description || '',
      image: initialData?.image || '',
      status: initialData?.status || 'active'
    },
    mode: 'onChange'
  });

  // Opciones para los selects
  const categoryOptions: Category[] = ['Kitchen', 'Electronics', 'Garden', 'Construction', 'Sports', 'Clothing'];
  const statusOptions: Status[] = ['active', 'inactive'];

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      goToDashboard();
    }
  };

  const onSubmit = async (data: CreateProductData) => {
    try {
      // Limpiar errores previos
      setError(null);
      
      if (isEdit && productId) {
        // Modo edición
        await updateProduct(productId, data as UpdateProductData);
        goToDashboardWithMessage('Product updated successfully!');
      } else {
        // Modo creación
        await createProduct(data);
        goToDashboardWithMessage('Product created successfully!');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      // El error ya se maneja en el contexto, pero podemos mostrar feedback adicional
      alert(`Error ${isEdit ? 'updating' : 'creating'} product. Please try again.`);
    }
  };

  // Usar isSubmitting del formulario O isLoading del contexto
  const formIsLoading = isSubmitting || isLoading;

  return (
    <div className="card-body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Product Name */}
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">
              Product Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              placeholder="Enter product name"
              disabled={formIsLoading}
              {...register('name', {
                required: 'Product name is required',
                minLength: {
                  value: 2,
                  message: 'Product name must be at least 2 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Product name cannot exceed 100 characters'
                }
              })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          {/* Category */}
          <div className="col-md-6 mb-3">
            <label htmlFor="category" className="form-label">
              Category <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.category ? 'is-invalid' : ''}`}
              id="category"
              disabled={formIsLoading}
              {...register('category', {
                required: 'Category is required'
              })}
            >
              <option value="">Select Category</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category.message}</div>
            )}
          </div>
        </div>

        <div className="row">
          {/* Price */}
          <div className="col-md-6 mb-3">
            <label htmlFor="price" className="form-label">
              Price <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">€</span>
              <input
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="price"
                placeholder="0.00"
                step="0.01"
                disabled={formIsLoading}
                {...register('price', {
                  required: 'Price is required',
                  min: {
                    value: 0.01,
                    message: 'Price must be greater than 0'
                  },
                  max: {
                    value: 999999.99,
                    message: 'Price cannot exceed €999,999.99'
                  }
                })}
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price.message}</div>
              )}
            </div>
          </div>

          {/* Stock Quantity */}
          <div className="col-md-6 mb-3">
            <label htmlFor="stock" className="form-label">
              Stock Quantity <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
              id="stock"
              placeholder="0"
              disabled={formIsLoading}
              {...register('stock', {
                required: 'Stock quantity is required',
                min: {
                  value: 0,
                  message: 'Stock cannot be negative'
                },
                max: {
                  value: 999999,
                  message: 'Stock cannot exceed 999,999 units'
                }
              })}
            />
            {errors.stock && (
              <div className="invalid-feedback">{errors.stock.message}</div>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image URL
          </label>
          <input
            type="url"
            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
            id="image"
            placeholder="https://example.com/image.jpg"
            disabled={formIsLoading}
            {...register('image', {
              pattern: {
                value: /^https?:\/\/.+\..+/,
                message: 'Please enter a valid URL'
              }
            })}
          />
          {errors.image && (
            <div className="invalid-feedback">{errors.image.message}</div>
          )}
        </div>

        {/* Product Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Product Description
          </label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            id="description"
            rows={4}
            placeholder="Enter product description (optional)"
            disabled={formIsLoading}
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description cannot exceed 500 characters'
              }
            })}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}
          <div className="form-text">
            {watch('description')?.length || 0}/500 characters
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-select"
            id="status"
            disabled={formIsLoading}
            {...register('status')}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'active' ? 'Active' : 'Inactive'}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancel}
            disabled={formIsLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={formIsLoading}
          >
            {formIsLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEdit ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};