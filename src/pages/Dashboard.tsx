import { Header } from "../components/Header";
import { Message } from "../components/Message";
import { ProductActionsBar } from "../components/ProductActionsBar";
import { ProductTable } from "../components/ProductTable";
import { useRouteMessage } from "../hooks/useRouteMessage";

export const Dashboard = () => {
  const { message, type, clearMessage } = useRouteMessage();
  return (
    <>
      <Header title="Product Management" subtitle="Manage your products effectively" />
      <div className="card-body">
        <ProductActionsBar />
        <Message 
          message={message} 
          type={type} 
          onDismiss={clearMessage}
        />
        <ProductTable />
      </div>
    </>
  )
}
