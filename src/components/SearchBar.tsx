import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";

export const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useContext(ProductsContext);
  
  return (
    <>
      <div
        className="input-group"
        style={{ width: "300px" }}
      >
        <span className="input-group-text bg-transparent border-end-0">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>
    </>

  )
}
