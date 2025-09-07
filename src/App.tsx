import { RouterProvider } from "react-router";
import { ProductsProvider } from "./context/ProductsProvider";
import { router } from "./router/app.router";

function App() {

  return (
    <ProductsProvider>
      <RouterProvider router={router} />
    </ProductsProvider>
  );
}

export default App;
