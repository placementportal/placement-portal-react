import { ApplicationsContainer } from '../Components';
import { fetchApplicationsQuery } from '../utils';

export const loader = (queryClient, store) => {
  return async function () {
    try {
      const { jobsWithApplications } = await queryClient.ensureQueryData(
        fetchApplicationsQuery()
      );
      return { jobsWithApplications };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch jobs!';
      console.log(error);
      toast.error(errorMessage);
      return null;
    }
  };
};

const JobApplications = () => {
  return (
    <div>
      <ApplicationsContainer />
    </div>
  );
};
export default JobApplications;
