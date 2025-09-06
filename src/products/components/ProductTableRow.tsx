import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";
import type { Product } from "../types/product.interface";

type Props = {
  product: Product;
};

export const ProductTableRow = ({ product }: Props) => {
  const { handleView, handleEdit, handleDelete } = useContext(ProductsContext);
  
  return (
    <tr key={product.id}>
      <td className="fw-medium">
        {product.name}
      </td>
      <td>{product.category}</td>
      <td>{product.stock} units</td>
      <td>
        ${product.price.toFixed(2)}
      </td>
      <td className="text-center">
        {product.status ===
          "active" ? (
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
            onClick={() =>
              handleView(
                product.id
              )
            }
          >
           <i className="bi bi-eye"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm border-0"
            onClick={() =>
              handleEdit(
                product.id
              )
            }
          >
           <i className="bi bi-pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm border-0 text-danger"
            onClick={() =>
              handleDelete(
                product.id
              )
            }
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>

  )
}
