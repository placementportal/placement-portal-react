import { createSlice } from '@reduxjs/toolkit';

const jobs = {
  currentFilter: 'open',
  currentJobs: [],
  jobApply: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState: jobs,
  reducers: {
    changeFilter: (state, action) => {
      state.currentFilter = action.payload.newFilter;
    },
    setCurrentJobs: (state, action) => {
      state.currentJobs = action.payload.jobs;
    },
    setJobApply: (state, action) => {
      state.jobApply = action.payload.jobApply;
    },
    resetJobApply: (state) => {
      state.jobApply = null;
    },
  },
});

export const { changeFilter, setCurrentJobs, setJobApply, resetJobApply } =
  jobSlice.actions;

export default jobSlice.reducer;
