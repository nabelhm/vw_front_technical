import { useContext } from "react";
import { useProductNavigation } from "../hooks/useProductNavigation";
import { ProductsContext } from "../context/ProductsContext";
import type { Product } from "../types/product.interface";

type Props = {
  product: Product;
};

export const ProductTableRow = ({ product }: Props) => {
  const { goToViewProduct, goToEditProduct } = useProductNavigation();
  const { deleteProduct } = useContext(ProductsContext);
  
  const handleView = () => {
    goToViewProduct(product.id);
  };

  const handleEdit = () => {
    goToEditProduct(product.id);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );
    
    if (confirmed) {
      try {
        await deleteProduct(product.id);
        console.log('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };
  
  return (
    <tr key={product.id}>
      <td className="fw-medium">
        {product.name}
      </td>
      <td>{product.category}</td>
      <td>{product.stock} units</td>
      <td>
        {product.price.toFixed(2)} €
      </td>
      <td className="text-center">
        {product.status === "active" ? (
          <span className="badge bg-success">
            Active
          </span>
        ) : (
          <span className="badge bg-danger">
            Inactive
          </span>
        )}
      </td>
      <td className="text-center">
        <div
          className="btn-group border-0"
          role="group"
        >
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm border-0"
            onClick={handleView}
            title="View product"
          >
           <i className="bi bi-eye"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm border-0"
            onClick={handleEdit}
            title="Edit product"
          >
           <i className="bi bi-pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm border-0 text-danger"
            onClick={handleDelete}
            title="Delete product"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};