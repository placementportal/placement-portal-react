import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchStudentProfile, customFetch } from '../utils';

import {
  StudentIntro,
  StudentPersonal,
  StudentEducation,
  StudentExperience,
  StudentPlacement,
  StudentTraining,
} from '../Components';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Handle Job Apply */
    if (intent === 'updatePersonalDetails') {
      const url = `/student/personal`;
      try {
        await customFetch.post(url, formData);
        toast.success('Personal Details updated successfully!');
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message ||
          'Failed to update personal details!';
        toast.error(errorMessage);
        return error;
      }
    }
  };
};

export const loader = (queryClient) => {
  return async function () {
    try {
      const { profileDetails } = await queryClient.ensureQueryData(
        fetchStudentProfile()
      );
      return {
        profileDetails,
      };
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401 || error.response.status === 403)
        return redirect('/');
      return null;
    }
  };
};

const StudentDetails = () => {
  return (
    <div className="p-8 lg:p-12 flex flex-col gap-y-8">
      <StudentIntro />
      <StudentPersonal />
    </div>
  );
};
export default StudentDetails;
