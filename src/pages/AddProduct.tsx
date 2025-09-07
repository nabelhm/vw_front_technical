import { useProductNavigation } from '../hooks/useProductNavigation';
import { ProductForm } from '../components/ProductForm';
import { Header } from '../components/Header';

export const AddProduct = () => {
  const { goToDashboard } = useProductNavigation();

  const handleCancel = () => {
    goToDashboard();
  };

  return (
    <>
      <Header title="Add New Product" subtitle="Create a new product" />
      <div className="d-flex justify-content-between align-items-center m-4">
        <div>
          <button
            onClick={handleCancel}
            className="btn btn-success"
          >
            <i className="bi bi-arrow-left"></i> Back to Products
          </button>
         
        </div>
      </div>

      <ProductForm onCancel={handleCancel} />
    </>
  );
};