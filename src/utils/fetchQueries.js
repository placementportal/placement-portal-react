import { customFetch } from './axiosSetup';

export function fetchStudentProfile() {
  return {
    queryKey: ['privateProfile'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/profile');
      return data;
    },
  };
}

export function fetchStudentPersonal() {
  return {
    queryKey: ['personal'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/personal');
      return data;
    },
  };
}

export function fetchStudentEducation() {
  return {
    queryKey: ['education'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/education');
      return data;
    },
  };
}

export function fetchStudentExperiences() {
  return {
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/experience');
      return data;
    },
  };
}

export function fetchStudentPlacements() {
  return {
    queryKey: ['placements'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/placement');
      return data;
    },
  };
}

export function fetchStudentTrainings() {
  return {
    queryKey: ['trainings'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/training');
      return data;
    },
  };
}

export function fetchStudentSkills() {
  return {
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/skills');
      return data;
    },
  };
}

export function fetchStudentAchievements() {
  return {
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data } = await customFetch.get('/student/achievements');
      return data;
    },
  };
}

export function fetchApplicationsQuery() {
  const url = `/company/applications`;

  return {
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}

export function fetchCoursesQuery() {
  const url = `/batchDept/course`;

  return {
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}

export function fetchDeptQuery(courseId) {
  const url = `/batchDept/dept?courseId=${courseId}`;

  return {
    queryKey: [courseId, 'depts'],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}

export function fetchBatchQuery(courseId) {
  const url = `/batchDept/batch?courseId=${courseId}`;

  return {
    queryKey: [courseId, 'batches'],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}

export function fetchJobsQuery({ role, status }) {
  let url;
  if (role == 'student') url = `/student/jobs?status=${status}`;
  else if (role == 'company_admin') url = `/company/jobs?status=${status}`;

  return {
    queryKey: ['jobs', status],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}

export function fetchCourseOptions() {
  const url = `/courses/options`;

  return {
    queryKey: ['courseOptions'],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}
