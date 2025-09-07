interface ProductImageProps {
  image?: string;
  name: string;
}

export const ProductImage = ({ image, name }: ProductImageProps) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="card-img-top"
            style={{ height: '300px', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGVlMmU2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2Yjc1OGQiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
            }}
          />
        ) : (
          <div 
            className="card-img-top d-flex align-items-center justify-content-center bg-light"
            style={{ height: '300px' }}
          >
            <div className="text-center text-muted">
              <i className="bi bi-image fs-1 mb-2 d-block"></i>
              <p className="mb-0">No Image Available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};