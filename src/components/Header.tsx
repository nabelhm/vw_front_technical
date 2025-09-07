interface Props {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: Props) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center m-4">
        <div>
          <h2 className="h4 mb-0">
            {title}
          </h2>
          {subtitle && (
            <h3 className="h6 mb-0 text-muted">
              {subtitle}
            </h3>
          )}
        </div>
      </div>
    </>
  )
}
