import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  fetchStudentProfile,
  customFetch,
  fetchStudentPersonal,
  fetchStudentEducation,
  fetchStudentExperiences,
  fetchStudentPlacements,
  fetchStudentTrainings,
} from '../utils';

import {
  initialProfileSetup,
  setPersonalDetails,
  setEducationDetails,
  setExperiences,
  setPlacements,
  setTrainings,
} from '../features/studentProfile/studentProfileSlice';

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

    /* UPDATE PERSONAL DETAILS */
    if (intent === 'updatePersonalDetails') {
      const url = `/student/personal`;
      try {
        await customFetch.post(url, formData);
        toast.success('Personal Details updated successfully!');
        queryClient.removeQueries({ queryKey: ['personal'] });
        const { personalDetails } = await queryClient.fetchQuery(
          fetchStudentPersonal()
        );
        store.dispatch(setPersonalDetails({ personalDetails }));
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

    /* UPDATE PAST EDUCATION */
    if (intent === 'updatePastEducation') {
      const update = formData.get('update');
      const url = `/student/education/${update}`;
      try {
        await customFetch.post(url, formData);
        queryClient.removeQueries({ queryKey: ['education'] });
        const { educationDetails } = await queryClient.fetchQuery(
          fetchStudentEducation()
        );
        store.dispatch(setEducationDetails({ educationDetails }));
        document.getElementById('pastScoreModal').close();
        toast.success(`${update} data updated successfully!`);
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || `Failed to update ${update} data!`;
        document.getElementById('pastScoreError').innerText = errorMessage;
        return error;
      }
    }

    /* UPDATE CURRENT EDUCATION */
    if (intent === 'updateCurrentEducation') {
      const courseLevel = formData.get('courseLevel');
      const url = `/student/education/${courseLevel}`;

      const isLateralEntry = formData.get('isLateralEntry');
      let semestersCount = formData.get('semestersCount');
      let sem = isLateralEntry ? 3 : 1;

      const data = { scores: [] };
      while (semestersCount > 0) {
        const gpa = Number(formData.get(`gpa-${sem}`));
        const backsCount = Number(formData.get(`backsCount-${sem}`));
        if (isNaN(gpa) || isNaN(backsCount)) {
          document.getElementById('currentCourseError').innerText =
            'Invalid scores!';
          return null;
        }

        if (!gpa) break;
        data.scores.push({ gpa, backsCount });
        ++sem;
        --semestersCount;
      }

      try {
        await customFetch.post(url, data);
        queryClient.removeQueries({ queryKey: ['education'] });
        const { educationDetails } = await queryClient.fetchQuery(
          fetchStudentEducation()
        );
        store.dispatch(setEducationDetails({ educationDetails }));
        toast.success(`${courseLevel} data updated successfully!`);
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message ||
          `Failed to update ${courseLevel} data!`;
        toast.error(errorMessage);
        return error;
      }
    }

    /* CREATE NEW EXPERIENCE */
    if (intent === 'createExperience') {
      const url = `/student/experience/`;
      try {
        await customFetch.post(url, formData);
        document.getElementById('experienceModal').close();
        queryClient.removeQueries({ queryKey: ['experiences'] });
        const { experiences } = await queryClient.fetchQuery(
          fetchStudentExperiences()
        );
        store.dispatch(setExperiences({ experiences }));
        toast.success('Experience added successfully!');
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to add experience!';
        document.getElementById('experienceFormError').innerText = errorMessage;
        return error;
      }
    }

    /* UPDATE EXPERIENCE */
    if (intent === 'updateExperience') {
      const id = formData.get('experienceId');
      const url = `/student/experience/${id}`;
      try {
        await customFetch.patch(url, formData);
        queryClient.removeQueries({ queryKey: ['experiences'] });
        const { experiences } = await queryClient.fetchQuery(
          fetchStudentExperiences()
        );
        store.dispatch(setExperiences({ experiences }));
        document.getElementById('experienceModal').close();
        toast.success('Experience updated successfully!');
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to update experience!';
        document.getElementById('experienceFormError').innerText = errorMessage;
        return error;
      }
    }

    /* CREATE NEW TRAINING */
    if (intent === 'createTraining') {
      const url = `/student/training/`;
      try {
        await customFetch.post(url, formData);
        queryClient.removeQueries({ queryKey: ['trainings'] });
        const { trainings } = await queryClient.fetchQuery(
          fetchStudentTrainings()
        );
        store.dispatch(setTrainings({ trainings }));
        document.getElementById('trainingModal').close();
        toast.success('Training added successfully!');
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to add training!';
        document.getElementById('trainingFormError').innerText = errorMessage;
        return error;
      }
    }

    /* UPDATE TRAINING */
    if (intent === 'updateTraining') {
      const id = formData.get('trainingId');
      const url = `/student/training/${id}`;
      try {
        await customFetch.patch(url, formData);
        queryClient.removeQueries({ queryKey: ['trainings'] });
        const { trainings } = await queryClient.fetchQuery(
          fetchStudentTrainings()
        );
        store.dispatch(setTrainings({ trainings }));
        document.getElementById('trainingModal').close();
        toast.success('Training updated successfully!');
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to update training!';
        document.getElementById('trainingFormError').innerText = errorMessage;
        return error;
      }
    }

    /* CREATE PLACEMENT */
    if (intent === 'createPlacement') {
      const url = `/student/placement/`;
      try {
        await customFetch.post(url, formData);
        queryClient.removeQueries({ queryKey: ['placements'] });
        const { placements } = await queryClient.fetchQuery(
          fetchStudentPlacements()
        );
        store.dispatch(setPlacements({ placements }));
        document.getElementById('placementModal').close();
        toast.success('Placement added successfully!');
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to add placement!';
        document.getElementById('placementFormError').innerText = errorMessage;
        return error;
      }
    }

    /* UPDATE PLACEMENT */
    if (intent === 'updatePlacement') {
      const id = formData.get('placementId');
      const url = `/student/placement/${id}`;
      try {
        await customFetch.patch(url, formData);
        queryClient.removeQueries({ queryKey: ['placements'] });
        const { placements } = await queryClient.fetchQuery(
          fetchStudentPlacements()
        );
        store.dispatch(setPlacements({ placements }));
        document.getElementById('placementModal').close();
        toast.success('Placement updated successfully!');
        return redirect('/student-dashboard/');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to update placement!';
        document.getElementById('placementFormError').innerText = errorMessage;
        return error;
      }
    }
  };
};

export const loader = (queryClient, store) => {
  return async function () {
    try {
      const { profileDetails } = await queryClient.ensureQueryData(
        fetchStudentProfile()
      );
      store.dispatch(initialProfileSetup(profileDetails));
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
      <hr />
      <StudentPersonal />
      <hr />
      <StudentEducation />
      <hr />
      <StudentPlacement />
      <hr />
      <StudentExperience />
      <hr />
      <StudentTraining />
    </div>
  );
};
export default StudentDetails;
