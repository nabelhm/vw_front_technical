import { Outlet } from "react-router"

export const Layout = () => {
  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        <div className="card m-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
