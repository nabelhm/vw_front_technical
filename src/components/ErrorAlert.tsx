interface ErrorAlertProps {
  error: string;
  onGoBack?: () => void;
  showBackButton?: boolean;
}

export const ErrorAlert = ({ 
  error, 
  onGoBack, 
  showBackButton = true 
}: ErrorAlertProps) => {
  return (
    <div className="card-body">
      <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
        <div>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {error}
        </div>
        {showBackButton && onGoBack && (
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={onGoBack}
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};