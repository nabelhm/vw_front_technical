import { useProductNavigation } from "../hooks/useProductNavigation";

export const ProductBackBar = () => {
  const { goToDashboard } = useProductNavigation();

  const handleCancel = () => {
    goToDashboard();
  };

  return (
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
  )
}
