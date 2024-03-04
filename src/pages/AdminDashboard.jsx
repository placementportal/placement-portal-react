import Navbar from '../Components/Navbar';
import { Outlet, redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';

import { getOptions } from '../Components/SuperAdmin/NavOptions';
import { fetchCourseOptions, customFetch } from '../utils';
import { setCourseOptions } from '../features/courseOptions/courseOptions';
import { AddSingleStudent, CompanyModal, CourseModal } from '../Components';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Single Student */
    if (intent === 'addSingleStudent' || intent === 'updateSingleStudent') {
      let url = '/admin/students/single/';
      if (intent === 'updateSingleStudent') url += formData.get('studentId');
      try {
        if (intent === 'addSingleStudent')
          await customFetch.post(url, formData);
        else await customFetch.patch(url, formData);

        const courseId = formData.get('courseId');
        const departmentId = formData.get('departmentId');
        const batchId = formData.get('batchId');

        queryClient.removeQueries({ queryKey: ['students'], exact: true });
        queryClient.removeQueries({
          queryKey: ['students', courseId],
        });
        queryClient.removeQueries({
          queryKey: ['students', courseId, departmentId],
        });
        queryClient.removeQueries({
          queryKey: ['students', courseId, batchId],
        });
        toast.success('Student added successfully!');
        document.forms.addSingleStudentForm.reset();
        document.getElementById('addSingleStudentModal').close();
        return redirect('/admin-dashboard/students');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to add student!';
        document.getElementById('addSingleStudentFormError').textContent =
          errorMessage;
        return error;
      }
    }

    /* Course Creation and Updation */
    if (intent === 'addCourse' || intent === 'updateCourse') {
      console.log('adding course...');
      let url = '/courses/';
      if (intent === 'updateCourse') url += formData.get('courseId');
      try {
        if (intent === 'addCourse') await customFetch.post(url, formData);
        else await customFetch.patch(url, formData);

        queryClient.removeQueries({ queryKey: ['courseOptions'] });
        toast.success(
          `Course ${intent === 'addCourse' ? 'added' : 'updated'} successfully!`
        );
        document.forms.courseForm.reset();
        document.getElementById('courseModal').close();
        return redirect('/admin-dashboard/courses');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to add course!';
        document.getElementById('courseFormError').textContent = errorMessage;
        return error;
      }
    }

    /* Company Creation and Updation */
    if (intent === 'addCompany' || intent === 'updateCompany') {
      const companyId = formData.get('companyId');
      let url = `/admin/companies/`;
      if (intent === 'updateCompany') url += companyId;
      try {
        if (intent === 'addCompany') await customFetch.post(url, formData);
        else await customFetch.patch(url, formData);

        queryClient.removeQueries({ queryKey: ['companies'] });
        if (intent === 'updateCompany')
          queryClient.removeQueries({ queryKey: [companyId] });

        toast.success(
          `company ${
            intent === 'addCompany' ? 'added' : 'updated'
          } successfully!`
        );
        document.forms.companyForm.reset();
        document.getElementById('companyModal').close();
        return redirect('/admin-dashboard/companies');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message ||
          `Failed to ${intent === 'addCompany' ? 'add' : 'update'} company!`;
        document.getElementById('companyFormError').textContent = errorMessage;
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
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return redirect('/');
      }
      return error;
    }
  };
};

const CompanyDashboard = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Navbar options={getOptions(dispatch)} />
      <CourseModal />
      <CompanyModal />
      <AddSingleStudent />
      <Outlet />
    </>
  );
};
export default CompanyDashboard;
