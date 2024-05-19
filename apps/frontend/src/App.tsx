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
import CreateOrder from './pages/shop/orders/create';
import Printers from './pages/settings/printers';
import Settings from './pages/settings';

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
        path: 'takeaway/:customerId',
        element: <CreateOrder />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <Printers />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
