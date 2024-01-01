import { Outlet } from 'react-router-dom';

import Navbar from '../Components/Student/Navbar';

const StudentDashboard = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default StudentDashboard;
