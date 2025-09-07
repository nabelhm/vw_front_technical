import { Header } from "../components/Header"
import { ProductActionsBar } from "../components/ProductActionsBar"
import { ProductTable } from "../components/ProductTable"

export const Dashboard = () => {
  return (
    <>
      <Header title="Product Management" subtitle="Manage your products effectively" />
      <div className="card-body">
        <ProductActionsBar />
        <ProductTable />
      </div>
    </>
  )
}
