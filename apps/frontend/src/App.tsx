import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import AuthPage from './pages/auth';
import Layout from './pages/shop/layout';
import Dashboard from './pages/shop/dashboard';
import Takeaway from './pages/shop/orders/takeaway';
import Home from './pages/home';
import AuthWrapper from './components/wappers/auth-wrapper';
import LicenseWrapper from './components/wappers/license-wrapper';
import License from './pages/license';
import CreateOrder from './pages/shop/orders/components/create-order';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LicenseWrapper>
        <AuthWrapper>
          <Home />
        </AuthWrapper>
      </LicenseWrapper>
    ),
  },
  {
    path: '/login',
    element: (
      <LicenseWrapper>
        <AuthPage />
      </LicenseWrapper>
    ),
  },
  {
    path: '/license',
    element: <License />,
  },
  {
    path: ':shopId',
    element: (
      <LicenseWrapper>
        <AuthWrapper>
          <Layout />
        </AuthWrapper>
      </LicenseWrapper>
    ),
    children: [
      {
        path: '',
        element: <Navigate to={'/'} />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'takeaway',
        element: <Takeaway />,
      },
      {
        path: 'takeaway/new',
        element: <CreateOrder />,
      },
      {
        path: 'takeaway/:customerId',
        element: <CreateOrder />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
