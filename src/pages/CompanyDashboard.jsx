import Navbar from '../Components/Navbar';
import { Outlet, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import { options } from '../Components/CompanyAdmin/NavOptions';
import { fetchCourseOptions, customFetch, fetchJobsQuery } from '../utils';
import { setCourseOptions } from '../features/courseOptions/courseOptions';
import { setCurrentJobs } from '../features/jobs/jobsSlice';
import { CreateJobForm } from '../Components';
import { resetJobModalData } from '../features/jobCreateForm/jobCreateSlice';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Handle Job Creation & Updation */
    if (intent === 'createJob' || intent === 'updateJob') {
      /* Transforming Into Array */
      const receivingDepartments = formData.getAll('receivingDepartments');
      const keySkills = formData.getAll('keySkills');

      const data = Object.fromEntries(formData);
      data.receivingDepartments = receivingDepartments;
      data.keySkills = keySkills;

      let url = `/company/jobs`;
      const action = intent === 'createJob' ? 'create' : 'update';

      if (intent === 'updateJob') {
        const jobId = data['jobId'];
        url += `/${jobId}`;
      }

      try {
        if (intent === 'createJob') {
          await customFetch.post(url, data);
        } else {
          await customFetch.patch(url, data);
        }

        await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
        const { jobs } = await queryClient.fetchQuery(
          fetchJobsQuery({ role: 'company_admin', status: 'open' })
        );
        store.dispatch(setCurrentJobs({ jobs }));

        /* RESET FORM */
        document.forms[`${action}JobForm`].reset();
        store.dispatch(resetJobModalData());
        document.getElementById('createJobModal').close();
        toast.success(`Job ${action + 'd'} successfully!`);
        return redirect('/company-dashboard/jobs');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || `Failed to ${action} job!`;
        document.getElementById('jobCreateFormError').innerText = errorMessage;
        return error;
      }
    }
  };
};

export const loader = (queryClient, store) => {
  return async function () {
    try {
      const { options } = await queryClient.ensureQueryData(
        fetchCourseOptions()
      );
      store.dispatch(setCourseOptions({ options }));
      return true;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch courses!';
      console.log(error);
      toast.error(errorMessage);
      return null;
    }
  };
};

const CompanyDashboard = () => {
  return (
    <>
      <Navbar options={options} />
      <CreateJobForm />
      <Outlet />
    </>
  );
};
export default CompanyDashboard;
