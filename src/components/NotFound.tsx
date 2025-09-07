interface NotFoundProps {
  title?: string;
  message?: string;
  onGoBack?: () => void;
  buttonText?: string;
}

export const NotFound = ({ 
  title = 'Product Not Found',
  message = "The product you're looking for doesn't exist or has been removed.",
  onGoBack,
  buttonText = 'Go Back to Products'
}: NotFoundProps) => {
  return (
    <div className="card-body">
      <div className="text-center py-5">
        <i className="bi bi-box-seam fs-1 text-muted mb-3 d-block"></i>
        <h3 className="h5 text-muted">{title}</h3>
        <p className="text-muted mb-3">{message}</p>
        {onGoBack && (
          <button className="btn btn-primary" onClick={onGoBack}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};