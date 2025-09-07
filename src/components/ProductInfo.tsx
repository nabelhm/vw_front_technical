import type { Product } from '../types/product.interface';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warning';
    return 'success';
  };

  const getStockStatusText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="col-md-8">
      <div className="row">
        {/* Basic Info */}
        <div className="col-12 mb-4">
          <h3 className="h5 border-bottom pb-2 mb-3">Basic Information</h3>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label className="form-label fw-medium">Product Name</label>
              <p className="mb-0">{product.name}</p>
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label fw-medium">Category</label>
              <p className="mb-0">
                <span className="badge bg-secondary">{product.category}</span>
              </p>
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label fw-medium">Price</label>
              <p className="mb-0 fs-5 fw-medium text-success">€{product.price.toFixed(2)}</p>
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label fw-medium">Stock</label>
              <p className="mb-0">
                <span className={`badge bg-${getStockStatusColor(product.stock)} me-2`}>
                  {getStockStatusText(product.stock)}
                </span>
                {product.stock} units
              </p>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label fw-medium">Status</label>
              <p className="mb-0">
                <span className={`badge ${product.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                  {product.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="col-12 mb-4">
          <h3 className="h5 border-bottom pb-2 mb-3">Description</h3>
          <p className="text-muted mb-0">
            {product.description || 'No description available.'}
          </p>
        </div>

        {/* Timestamps */}
        <div className="col-12">
          <h3 className="h5 border-bottom pb-2 mb-3">Record Information</h3>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label className="form-label fw-medium">Created</label>
              <p className="mb-0 text-muted small">{formatDate(product.createdAt)}</p>
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label fw-medium">Last Updated</label>
              <p className="mb-0 text-muted small">{formatDate(product.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};