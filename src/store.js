import { configureStore } from '@reduxjs/toolkit';

import jobsSlice from './features/jobs/jobsSlice';
import userSlice from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    userState: userSlice,
    jobState: jobsSlice,
  },
});
