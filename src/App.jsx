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
  JobApplications,
  PublicStudentProfile,
  SingleJob,
  JobCreatePage,
  JobEditPage,
  SingleJobApplications,
} from './pages/index';

import { store } from './store';

import { action as loginAction } from './pages/Login';
import { action as jobsAction } from './pages/Jobs';
import { action as createJobAction } from './pages/JobCreatePage';
import { action as editJobAction } from './pages/JobEditPage';
import { action as studentDetailsAction } from './pages/StudentDetails';
import { action as companyApplicationAction } from './pages/JobApplications';
import { action as singleJobAction } from './pages/SingleJob';

import { loader as loginLoader } from './pages/Login';
import { loader as companyDBLoader } from './pages/CompanyDashboard';
import { loader as studentDBloader } from './pages/StudentDetails';
import { loader as jobsLoader } from './pages/Jobs';
import { loader as jobsApplicationsLoader } from './pages/JobApplications';
import { loader as studentProfileLoader } from './pages/PublicStudentProfile';
import { loader as singleJobLoader } from './pages/SingleJob';
import { loader as editJobLoader } from './pages/JobEditPage';
import { loader as singleJobApplicationsLoader } from './pages/SingleJobApplications';

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
        loader: studentDBloader(queryClient, store),
        action: studentDetailsAction(queryClient, store),
      },
      {
        path: 'jobs',
        children: [
          {
            path: '',
            element: <JobsPage />,
            loader: jobsLoader(queryClient, store),
            action: jobsAction(queryClient, store),
            index: true,
          },
          {
            path: ':jobId',
            element: <SingleJob />,
            loader: singleJobLoader(queryClient, store),
            action: singleJobAction(QueryClient, store),
          },
        ],
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
    loader: companyDBLoader(queryClient, store),
    children: [
      {
        path: 'create-job',
        element: <JobCreatePage />,
        action: createJobAction(queryClient, store),
      },
      {
        path: 'edit-job/:jobId',
        element: <JobEditPage />,
        loader: editJobLoader(queryClient, store),
        action: editJobAction(queryClient, store),
      },
      {
        path: 'jobs',
        children: [
          {
            path: '',
            element: <JobsPage />,
            loader: jobsLoader(queryClient, store),
            index: true,
          },
          {
            path: ':jobId',
            children: [
              {
                path: '',
                index: true,
                element: <SingleJob />,
                loader: singleJobLoader(queryClient, store),
              },
              {
                path: 'applications',
                element: <SingleJobApplications />,
                loader: singleJobApplicationsLoader(queryClient, store),
              },
            ],
          },
        ],
      },
      {
        path: 'applications',
        children: [
          {
            path: '',
            element: <JobApplications />,
            loader: jobsApplicationsLoader(queryClient, store),
            action: companyApplicationAction(queryClient, store),
            index: true,
          },
          {
            path: ':applicationId/students/:studentId',
            element: <PublicStudentProfile />,
            loader: studentProfileLoader(queryClient, store),
          },
        ],
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
