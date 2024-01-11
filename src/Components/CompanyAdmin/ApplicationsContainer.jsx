import { useLoaderData } from 'react-router-dom';
import SingleJobApplication from './SingleJobApplication';

const ApplicationsContainer = () => {
  const { jobsWithApplications } = useLoaderData();

  return (
    <div>
      {jobsWithApplications.map((job) => {
        const { _id, profile, openingsCount, deadline, applications } = job;
        return (
          <SingleJobApplication
            key={_id}
            jobId={_id}
            profile={profile}
            openingsCount={openingsCount}
            deadline={deadline}
            applications={applications}
          />
        );
      })}
    </div>
  );
};
export default ApplicationsContainer;
