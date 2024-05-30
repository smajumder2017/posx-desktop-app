import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import AuthPage from './pages/auth';
import Layout from './pages/shop/layout';
import Dashboard from './pages/shop/restaurant/dashboard';
import Takeaway from './pages/shop/restaurant/orders/takeaway';
import Home from './pages/home';
import Shop from './pages/shop';
import AuthWrapper from './components/wappers/auth-wrapper';
import LicenseWrapper from './components/wappers/license-wrapper';
import License from './pages/license';
import CreateOrder from './pages/shop/restaurant/orders/create';
import OrderHistory from './pages/shop/restaurant/orders/history';
import Printers from './pages/shop/restaurant/settings/printers';
import Settings from './pages/shop/restaurant/settings';

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
    path: ':shopId/restaurant',
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
        path: 'all-orders',
        element: <OrderHistory />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <Printers />,
          },
          {
            path: 'license',
            element: <License />,
          },
        ],
      },
    ],
  },
  {
    path: ':shopId',
    element: (
      <LicenseWrapper>
        <AuthWrapper>
          <Shop />
        </AuthWrapper>
      </LicenseWrapper>
    ),
  },
  { path: '*', element: <div>Page not found</div> },
  // {
  //   path: ':shopId',
  //   element: (
  //     <LicenseWrapper>
  //       <AuthWrapper>
  //         <Layout />
  //       </AuthWrapper>
  //     </LicenseWrapper>
  //   ),
  //   children: [
  //     {
  //       path: '',
  //       element: <Navigate to={'/'} />,
  //     },
  //     {
  //       path: 'dashboard',
  //       element: <Dashboard />,
  //     },
  //     {
  //       path: 'takeaway',
  //       element: <Takeaway />,
  //     },
  //     {
  //       path: 'takeaway/:customerId',
  //       element: <CreateOrder />,
  //     },
  //     {
  //       path: 'settings',
  //       element: <Settings />,
  //       children: [
  //         {
  //           index: true,
  //           element: <Printers />,
  //         },
  //       ],
  //     },
  //   ],
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
