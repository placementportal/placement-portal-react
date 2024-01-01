import { createSlice } from '@reduxjs/toolkit';

const jobs = {
  currentFilter: 'open',
  currentJobs: [],
  jobApplyId: '',
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
    setJobApplyId: (state, action) => {
      state.jobApplyId = action.payload.jobApplyId;
    },
    resetJobApplyId: (state) => {
      state.jobApplyId = '';
    },
  },
});

export const { changeFilter, setCurrentJobs, setJobApplyId, resetJobApplyId } =
  jobSlice.actions;

export default jobSlice.reducer;
