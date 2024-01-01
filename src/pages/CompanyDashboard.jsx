import Navbar from '../Components/Student/Navbar';
import { Outlet } from 'react-router-dom';

const CompanyDashboard = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default CompanyDashboard;
