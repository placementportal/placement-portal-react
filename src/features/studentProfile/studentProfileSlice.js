import { createSlice } from '@reduxjs/toolkit';

const studentProfile = {
};

const jobSlice = createSlice({
  name: 'studentProfile',
  initialState: studentProfile,
  reducers: {
    initialProfileSetup: (state, action) => {
      for (let key in action.payload) {
        if (!state[key])
          state[key] = action.payload[key];
      }
    },
    setPersonalDetails: (state, action) => {
      state.personalDetails = action.payload.personalDetails;
    },
    setEducationDetails: (state, action) => {
      state.educationDetails = action.payload.educationDetails;
    },
    setExperiences: (state, action) => {
      state.experiences = action.payload.experiences;
    },
    setPlacements: (state, action) => {
      state.placements = action.payload.placements;
    },
    setTrainings: (state, action) => {
      state.trainings = action.payload.trainings;
    },
  },
});

export const {
  initialProfileSetup,
  setPersonalDetails,
  setEducationDetails,
  setPlacements,
  setTrainings,
  setExperiences,
} = jobSlice.actions;

export default jobSlice.reducer;