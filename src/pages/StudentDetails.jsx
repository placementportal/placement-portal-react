import {
  StudentPersonal,
  StudentEducation,
  StudentExperience,
  StudentPlacement,
  StudentTraining,
  StudentAward,
} from '../Components';

import { redirect } from 'react-router-dom';
import { customFetch } from '../utils';

export const loader = (queryClient) => {
  return async function () {
    try {
      const personal = await queryClient.ensureQueryData(personalDetailQuery());
      const education = await queryClient.ensureQueryData(
        educationDetailQuery()
      );
      const experience = await queryClient.ensureQueryData(
        experienceDetailQuery()
      );
      const placement = await queryClient.ensureQueryData(
        placementDetailQuery()
      );
      const training = await queryClient.ensureQueryData(trainingDetailQuery());
      const award = await queryClient.ensureQueryData(awardDetailQuery());

      return {
        personal,
        education,
        experience,
        placement,
        training,
        award,
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
    <div className="flex flex-wrap justify-center items-center gap-8 px-8 py-4">
      <StudentPersonal />
      <StudentEducation />
      <StudentExperience />
      <StudentPlacement />
      <StudentTraining />
      <StudentAward />
    </div>
  );
};
export default StudentDetails;

function personalDetailQuery() {
  return {
    queryKey: ['personal'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/personal');
      return data;
    },
  };
}

function educationDetailQuery() {
  return {
    queryKey: ['education'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/education');
      return data;
    },
  };
}

function experienceDetailQuery() {
  return {
    queryKey: ['experience'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/experience');
      return data;
    },
  };
}

function placementDetailQuery() {
  return {
    queryKey: ['placement'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/placement');
      return data;
    },
  };
}

function trainingDetailQuery() {
  return {
    queryKey: ['training'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/training');
      return data;
    },
  };
}

function awardDetailQuery() {
  return {
    queryKey: ['award'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/award');
      return data;
    },
  };
}
