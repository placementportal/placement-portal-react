import { configureStore } from '@reduxjs/toolkit';

import jobsSlice from './features/jobs/jobsSlice';
import userSlice from './features/user/userSlice';
import courseOptionsSlice from './features/courseOptions/courseOptions';
import studentProfileSlice from './features/studentProfile/studentProfileSlice';
import jobCreateSlice from './features/jobCreateForm/jobCreateSlice';

export const store = configureStore({
  reducer: {
    userState: userSlice,
    jobState: jobsSlice,
    courseOptions: courseOptionsSlice,
    studentProfileState: studentProfileSlice,
    jobCreateFormState: jobCreateSlice,
  },
});
