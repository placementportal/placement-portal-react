import { customFetch } from './axiosSetup';

import {
  getStudentJobFilters,
  getCompanyJobFilters,
  getCourseOptions,
  getDepartmentOptions,
  getBatchOptions,
} from './prepareOptions';

import {
  fetchJobsQuery,
  fetchCoursesQuery,
  fetchDeptQuery,
  fetchBatchQuery,
} from './fetchQueries';

import { formatDate } from './jsUtils';

export {
  customFetch,

  /* Prepare Options */
  getStudentJobFilters,
  getCompanyJobFilters,
  getCourseOptions,
  getDepartmentOptions,
  getBatchOptions,

  /* Fetch Queries */
  fetchJobsQuery,
  fetchCoursesQuery,
  fetchDeptQuery,
  fetchBatchQuery,

  /* JS utils */
  formatDate,
};
