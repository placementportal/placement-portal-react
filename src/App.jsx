import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  Login,
  StudentDashboard,
  AdminDashboard,
  CompanyDashboard,
  StudentDetails,
  JobsPage,
} from './pages/index';

import { store } from './store';

import { action as loginAction } from './pages/Login';
import { action as jobsAction } from './pages/Jobs';

import { loader as loginLoader } from './pages/Login';
import { loader as studentDBloader } from './pages/StudentDetails';
import { loader as jobsLoader } from './pages/Jobs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    action: loginAction,
    loader: loginLoader(store),
  },
  {
    path: '/student-dashboard',
    element: <StudentDashboard />,
    children: [
      {
        index: true,
        element: <StudentDetails />,
        loader: studentDBloader(queryClient),
      },
      {
        path: 'jobs',
        element: <JobsPage />,
        loader: jobsLoader(queryClient, store),
        action: jobsAction(queryClient, store),
      },
    ],
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/company-dashboard',
    element: <CompanyDashboard />,
    children: [
      {
        path: 'jobs',
        element: <JobsPage />,
        loader: jobsLoader(queryClient, store),
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};
export default App;
