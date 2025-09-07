export const LoadingSpinner = () => {
  return (
    <div className="card-body">
      <div className="d-flex justify-content-center py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    </div>
  )
}
