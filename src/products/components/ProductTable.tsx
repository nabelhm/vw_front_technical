import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";
import { ProductTableRow } from "./ProductTableRow";

export const ProductTable = () => {
  const { products, handleSort, sortField, sortOrder } = useContext(ProductsContext);

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <i className="bi bi-arrow-down-up text-muted small"></i>;
    }
    return sortOrder === 'asc' 
      ? <i className="bi bi-arrow-up text-primary small"></i>
      : <i className="bi bi-arrow-down text-primary small"></i>;
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('name')}>
              Product Name {getSortIcon('name')}
            </th>
            <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('category')}>
              Category {getSortIcon('category')}
            </th>
            <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('stock')}>
              Stock Levels {getSortIcon('stock')}
            </th>
            <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('price')}>
              Price {getSortIcon('price')}
            </th>
            <th scope="col" style={{cursor: 'pointer'}} onClick={() => handleSort('status')}>
              Status {getSortIcon('status')}
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
