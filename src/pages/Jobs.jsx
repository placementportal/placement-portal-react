import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { JobsContainer, SelectInput } from '../Components';

import {
  changeFilter,
  setCurrentJobs,
  resetJobApplyId,
} from '../features/jobs/jobsSlice';
import { customFetch } from '../utils';

import JobApplicationForm from '../Components/Student/JobApplicationForm';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const jobId = store.getState()?.jobState?.jobApplyId;
    const url = `/student/jobs/${jobId}/apply`;
    try {
      await customFetch.post(url, formData);
      await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
      await queryClient.refetchQueries({ queryKey: ['jobs', 'applied'] });
      const { jobs } = await queryClient.fetchQuery(
        fetchJobsQuery({ role: 'student', status: 'open' })
      );
      store.dispatch(setCurrentJobs({ jobs }));
      store.dispatch(resetJobApplyId());
      document.getElementById('jobApplicationModal').close();
      toast.success('Applied successfully!');
      return redirect('/student-dashboard/jobs');
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to apply for job!';
      toast.error(errorMessage);
      return error;
    }
  };
};

export const loader = (queryClient, store) => {
  return async function () {
    const { role, companyId } = store.getState()?.userState?.user;

    try {
      const { jobs } = await queryClient.ensureQueryData(
        fetchJobsQuery({ role, companyId, status: 'open' })
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
  const { role, companyId } = useSelector((state) => state.userState.user);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  let jobOptions;
  if (role == 'student')
    jobOptions = ['open', 'applied', 'shortlisted', 'rejected', 'hired'];
  if (role == 'company_admin') jobOptions = ['open', 'expired'];

  async function handleJobChange(e) {
    const newFilter = e.currentTarget.value;
    dispatch(changeFilter({ newFilter }));
    const { jobs } = await queryClient.ensureQueryData(
      fetchJobsQuery({ status: newFilter, companyId, role })
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

export function fetchJobsQuery({ role, companyId, status }) {
  let url;
  if (role == 'student') url = `/student/jobs?status=${status}`;
  else if (role == 'company_admin')
    url = `/company/${companyId}/jobs?status=${status}`;

  return {
    queryKey: ['jobs', status],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}
