import { useState } from "react";
import type { Product } from "./products/types/product.interface";
import { Header } from "./products/components/Header";
import { ProductActionsBar } from "./products/components/ProductActionsBar";
import { ProductTable } from "./products/components/ProductTable";

// Mock data
const productsMock: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 79.99,
    stock: 25,
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    status: "active",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    stock: 50,
    description:
      "Comfortable and sustainable organic cotton t-shirt available in multiple colors. Made with eco-friendly materials.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    status: "active",
    createdAt: "2024-01-14T09:30:00.000Z",
    updatedAt: "2024-01-14T09:30:00.000Z",
  },
  {
    id: "3",
    name: "Smart Home Security Camera",
    category: "Electronics",
    price: 149.99,
    stock: 8,
    description:
      "1080p HD security camera with night vision, motion detection, and mobile app integration. Easy installation and setup.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400",
    status: "active",
    createdAt: "2024-01-13T14:20:00.000Z",
    updatedAt: "2024-01-13T14:20:00.000Z",
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>(productsMock);

  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
    // TODO: Implement
  };
  
  const handleView = (id: string) => {
    console.log("View product:", id);
    // TODO: Implement
  };

  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
  };

  const handleAddProduct = () => {
    console.log("Add new product");
    // TODO: Implement
  };

  return (
    <>
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="container">
          <div className="card m-4">
            <Header title="Product Management" subtitle="Manage your products effectively" />
            <div className="card-body">
              <ProductActionsBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleAddProduct={handleAddProduct}
              />
              <ProductTable
                products={products}
                handleView={handleView}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
