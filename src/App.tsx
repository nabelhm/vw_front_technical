import { useState } from "react";
import { Header } from "./products/components/Header";
import { ProductActionsBar } from "./products/components/ProductActionsBar";
import { ProductTable } from "./products/components/ProductTable";

function App() {

  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <>
        <div className="container-fluid bg-light min-vh-100 py-4">
          <div className="container">
            <div className="card m-4">
              <Header title="Product Management" subtitle="Manage your products effectively" />
              <div className="card-body">
              <ProductActionsBar />
              <ProductTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
