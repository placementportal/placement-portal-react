import { customFetch, fetchSingleJobApplicationsQuery } from '../utils';
import { PlacementModal, SingleJobApplication } from '../Components';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Create on-campus placement - Hire Candidate */
    if (intent === 'createPlacement') {
      try {
        const applicationId = formData.get('applicationId');
        const url = `/company/applications/${applicationId}/placement`;
        await customFetch.post(url, formData);

        await queryClient.refetchQueries({ queryKey: ['applications'] });
        await queryClient.ensureQueryData(fetchSingleJobApplicationsQuery());

        /* RESET FORM */
        document.forms.placementForm.reset();
        document.getElementById('placementFormError').innerText = '';
        document.getElementById('placementModal').close();
        toast.success('Candidate hired successfully!');
        return redirect('/company-dashboard/applications');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message ||
          `Failed to create on-campus placement!`;
        document.getElementById('placementFormError').innerText = errorMessage;
        return error;
      }
    }
  };
};

export const loader = (queryClient, store) => {
  return async function ({ params }) {
    const jobId = params.jobId;
    try {
      const { job } = await queryClient.ensureQueryData(
        fetchSingleJobApplicationsQuery(jobId)
      );
      return { job, jobId };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch job!';
      console.log(error);
      toast.error(errorMessage);
      return null;
    }
  };
};

const SingleJobApplications = () => {
  const { job, jobId } = useLoaderData();

  const [modalData, setModalData] = useState({
    onCampus: true,
    action: 'create',
  });

  return (
    <div>
      <PlacementModal modalData={modalData} />
      <SingleJobApplication
        jobId={jobId}
        profile={job?.profile}
        openingsCount={job?.openingsCount}
        deadline={job?.deadline}
        applications={job?.applications}
        setModalData={setModalData}
      />
    </div>
  );
};
export default SingleJobApplications;
