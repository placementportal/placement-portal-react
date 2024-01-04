import { customFetch } from './axiosSetup';

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
  else if (role == 'company_admin')
    url = `/company/jobs?status=${status}`;

  return {
    queryKey: ['jobs', status],
    queryFn: async () => {
      const { data } = await customFetch.get(url);
      return data;
    },
  };
}
