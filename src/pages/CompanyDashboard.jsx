import Navbar from '../Components/Navbar';
import { Outlet, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import { options } from '../Components/CompanyAdmin/NavOptions';
import { fetchCoursesQuery, customFetch, fetchJobsQuery } from '../utils';
import { setCourses } from '../features/courseInfo/courseInfoSlice';
import { setCurrentJobs } from '../features/jobs/jobsSlice';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    /* Transforming Into Array */
    const receivingDepartments = formData.getAll('receivingDepartments');
    const receivingBatches = formData.getAll('receivingBatches');
    const keySkills = formData.getAll('keySkills');

    data.receivingBatches = receivingBatches;
    data.receivingDepartments = receivingDepartments;
    data.keySkills = keySkills;

    const intent = formData.get('intent');

    /* Handle Job Creation */
    if (intent === 'createJob') {
      const url = `/company/jobs`;
      try {
        await customFetch.post(url, data);
        await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
        const { jobs } = await queryClient.fetchQuery(
          fetchJobsQuery({ role: 'company_admin', status: 'open' })
        );
        store.dispatch(setCurrentJobs({ jobs }));

        /* RESET FORM */
        document.forms.createJobForm.reset();
        const skillsContainer = document.getElementById('skillsContainer');
        while (skillsContainer.children.length > 1) {
          skillsContainer.removeChild(skillsContainer.children[1])
        }

        document.getElementById('createJobModal').close();
        toast.success('Created successfully!');
        return redirect('/company-dashboard/jobs');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to create job!';
        toast.error(errorMessage);
        return error;
      }
    }
  };
};

export const loader = (queryClient, store) => {
  return async function () {
    try {
      const { courses } = await queryClient.ensureQueryData(
        fetchCoursesQuery()
      );
      store.dispatch(setCourses({ courses }));
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
      <Outlet />
    </>
  );
};
export default CompanyDashboard;
