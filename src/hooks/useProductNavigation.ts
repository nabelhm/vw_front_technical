import { useNavigate } from 'react-router';

export const useProductNavigation = () => {
  const navigate = useNavigate();
  
  return {
    goToAddProduct: () => navigate('/add-product'),
    goToEditProduct: (id: string) => navigate(`/edit-product/${id}`),
    goToViewProduct: (id: string) => navigate(`/product/${id}`),
    goToDashboard: () => navigate('/'),
    
    goToDashboardWithMessage: (message: string, type: 'success' | 'error' = 'success') => {
      navigate('/', { 
        state: { message, type } 
      });
    },
    
    goBack: () => navigate(-1),
    goTo: (path: string) => navigate(path),
    redirectTo: (path: string) => navigate(path, { replace: true })
  };
};