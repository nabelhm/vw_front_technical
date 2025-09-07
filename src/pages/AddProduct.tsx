import { ProductForm } from '../components/ProductForm';
import { Header } from '../components/Header';
import { ProductBackBar } from '../components/ProductBackBar';

export const AddProduct = () => {

  return (
    <>
      <Header title="Add New Product" subtitle="Create a new product" />
      <ProductBackBar />
      <ProductForm />
    </>
  );
};