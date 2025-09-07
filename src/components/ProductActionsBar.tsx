import { useProductNavigation } from "../hooks/useProductNavigation";
import { SearchBar } from "./SearchBar";

export const ProductActionsBar = () => {
  const { goToAddProduct } = useProductNavigation();

  const handleAddProduct = (event: React.MouseEvent) => {
    event?.preventDefault();
    goToAddProduct();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-0">
            Products
          </h2>
        </div>
        <div className="d-flex gap-2">
          <SearchBar />

          <button
            onClick={handleAddProduct}
            className="btn btn-success"
          >
            <i className="bi bi-plus"></i> Add Product
          </button>
        </div>
      </div>
    </>
  );
};