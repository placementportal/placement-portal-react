import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  Login,
  StudentDashboard,
  AdminDashboard,
  CompanyDashboard,
} from './pages/index';

import { action as loginAction } from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    action: loginAction,
  },
  {
    path: '/student-dashboard',
    element: <StudentDashboard />,
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/company-dashboard',
    element: <CompanyDashboard />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
