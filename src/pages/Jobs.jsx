import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { JobsContainer, SelectInput, JobApplicationForm } from '../Components';

import {
  changeFilter,
  setCurrentJobs,
  resetJobApply,
} from '../features/jobs/jobsSlice';

import {
  customFetch,
  fetchJobsQuery,
  getStudentJobFilters,
  getCompanyJobFilters,
} from '../utils';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Handle Job Apply */
    if (intent === 'jobApplyAction') {
      const jobId = store.getState()?.jobState?.jobApply?.jobId;
      const url = `/student/jobs/${jobId}/apply`;
      try {
        await customFetch.post(url, formData);
        await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
        await queryClient.refetchQueries({ queryKey: ['jobs', 'applied'] });
        const { jobs } = await queryClient.fetchQuery(
          fetchJobsQuery({ role: 'student', status: 'open' })
        );
        store.dispatch(setCurrentJobs({ jobs }));
        store.dispatch(resetJobApply());
        document.getElementById('jobApplicationModal').close();
        document.getElementById('jobApplicationFormError').innerText = '';
        toast.success('Applied successfully!');
        return redirect('/student-dashboard/jobs');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to apply for job!';
        document.getElementById('jobApplicationFormError').innerText =
          errorMessage;
        return error;
      }
    }
  };
};

export const loader = (queryClient, store) => {
  return async function () {
    const { role } = store.getState()?.userState?.user;

    try {
      const { jobs } = await queryClient.ensureQueryData(
        fetchJobsQuery({ role, status: 'open' })
      );
      store.dispatch(setCurrentJobs({ jobs }));
      return true;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch jobs!';
      console.log(error);
      toast.error(errorMessage);
      return null;
    }
  };
};

const Jobs = () => {
  const { currentFilter } = useSelector((state) => state.jobState);
  const { role } = useSelector((state) => state.userState.user);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  let jobOptions;
  if (role == 'student') jobOptions = getStudentJobFilters;
  if (role == 'company_admin') jobOptions = getCompanyJobFilters;

  async function handleJobChange(e) {
    const newFilter = e.currentTarget.value;
    dispatch(changeFilter({ newFilter }));
    const { jobs } = await queryClient.ensureQueryData(
      fetchJobsQuery({ status: newFilter, role })
    );
    dispatch(setCurrentJobs({ jobs }));
  }

  return (
    <section className="p-4 sm:p-8 ">
      <div className="flex flex-wrap items-center justify-between">
        <h3 className="font-medium text-2xl">Jobs for you:</h3>
        <SelectInput
          options={jobOptions}
          label="Filter your jobs"
          value={currentFilter}
          id="jobFilterSelect"
          changeFn={handleJobChange}
        />
      </div>
      <JobsContainer />

      {role === 'student' && currentFilter === 'open' && <JobApplicationForm />}
    </section>
  );
};
export default Jobs;
