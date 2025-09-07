import { createBrowserRouter } from "react-router";
import { Dashboard } from "../pages/Dashboard";
import { AddProduct } from "../pages/AddProduct";
import { Layout } from "../components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
    ],
  },
]);