interface ProductActionsProps {
  onEdit: () => void;
  onCancel: () => void;
}

export const ProductActions = ({ onEdit, onCancel }: ProductActionsProps) => {
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="d-flex justify-content-end gap-2">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onEdit}
            className="btn btn-success"
          >
            <i className="bi bi-pencil me-1"></i>
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};