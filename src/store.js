import { configureStore } from '@reduxjs/toolkit';

import jobsSlice from './features/jobs/jobsSlice';
import userSlice from './features/user/userSlice';
import courseInfoSlice from './features/courseInfo/courseInfoSlice';
import studentProfileSlice from './features/studentProfile/studentProfileSlice';

export const store = configureStore({
  reducer: {
    userState: userSlice,
    jobState: jobsSlice,
    courseInfoState: courseInfoSlice,
    studentProfileState: studentProfileSlice,
  },
});
