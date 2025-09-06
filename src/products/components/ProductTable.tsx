import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";
import { ProductTableRow } from "./ProductTableRow";

export const ProductTable = () => {
  const { products } = useContext(ProductsContext);

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">Product Name</th>
            <th scope="col">Category</th>
            <th scope="col">Stock Levels</th>
            <th scope="col">Price</th>
            <th scope="col">Status</th>
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
