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
  fetchStudentPrivateProfile,
  fetchStudentPublicProfile,
  fetchStudentPersonal,
  fetchStudentEducation,
  fetchStudentExperiences,
  fetchStudentPlacements,
  fetchStudentTrainings,
  fetchStudentSkills,
  fetchStudentAchievements,
  fetchCourseOptions,
  fetchSingleJobQuery,
  fetchSingleJobApplicationsQuery,
  fetchStudents,
  fetchCompanies,
  fetchSingleCompany,
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
  fetchCompanies,
  fetchSingleCompany,
  fetchStudents,
  fetchJobsQuery,
  fetchCoursesQuery,
  fetchDeptQuery,
  fetchBatchQuery,
  fetchApplicationsQuery,
  fetchStudentPrivateProfile,
  fetchStudentPublicProfile,
  fetchStudentPersonal,
  fetchStudentEducation,
  fetchStudentExperiences,
  fetchStudentPlacements,
  fetchStudentTrainings,
  fetchStudentSkills,
  fetchStudentAchievements,
  fetchCourseOptions,
  fetchSingleJobQuery,
  fetchSingleJobApplicationsQuery,

  /* JS utils */
  formatDate,
};
