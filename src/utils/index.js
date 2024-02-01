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
  fetchApplicationsQuery,
  fetchStudentProfile,
  fetchStudentPersonal,
  fetchStudentEducation,
  fetchStudentExperiences,
  fetchStudentPlacements,
  fetchStudentTrainings,
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
  fetchApplicationsQuery,
  fetchStudentProfile,
  fetchStudentPersonal,
  fetchStudentEducation,
  fetchStudentExperiences,
  fetchStudentPlacements,
  fetchStudentTrainings,

  /* JS utils */
  formatDate,
};
