import { Outlet } from "react-router"

export const Layout = () => {
  return (
    <div className="container-fluid bg-light min-vh-100 py-4 d-flex flex-column">
      <div className="container flex-grow-1 d-flex flex-column">
        <div className="card m-4 flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}