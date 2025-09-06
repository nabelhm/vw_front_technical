import { SearchBar } from "./SearchBar";

type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddProduct: () => void;
};

export const ProductActionsBar = ({ searchTerm, setSearchTerm, handleAddProduct }: Props) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-0">
            Products
          </h2>
        </div>
        <div className="d-flex gap-2">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <button
            onClick={handleAddProduct}
            className="btn btn-success"
          >
            <i className="bi bi-plus"></i> Add Product
          </button>
        </div>
      </div>
    </>
  )
}
