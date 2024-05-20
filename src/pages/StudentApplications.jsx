import { StudentApplicationContainer } from '../Components';
import { fetchStudentApplications } from '../utils';
import { toast } from 'react-toastify';

export const loader = (queryClient, store) => {
  return async function () {
    try {
      const { applications } = await queryClient.ensureQueryData(
        fetchStudentApplications()
      );
      return { applications };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch applications!';
      console.log(error);
      toast.error(errorMessage);
      return null;
    }
  };
};

const StudentApplications = () => {
  return (
    <div>
      <StudentApplicationContainer />
    </div>
  );
};
export default StudentApplications;
