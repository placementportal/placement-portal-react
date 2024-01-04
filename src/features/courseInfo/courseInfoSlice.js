import { createSlice } from '@reduxjs/toolkit';

const courses = {};

const courseSlice = createSlice({
  name: 'courses',
  initialState: courses,
  reducers: {
    setCourses: (state, action) => {
      for (let course of action.payload.courses) {
        state[course._id] = {
          courseName: course.courseName,
          departments: {},
          batches: {},
        };
      }
    },

    setDepartments: (state, action) => {
      const courseId = action.payload.courseId;
      const course = state[courseId];
      for (let dept of action.payload.departments) {
        course.departments[dept._id] = {
          departmentName: dept.departmentName,
          departmentCode: dept.departmentCode,
        };
      }
    },

    setBatches: (state, action) => {
      const courseId = action.payload.courseId;
      const course = state[courseId];
      for (let batch of action.payload.batches) {
        course.batches[batch._id] = batch.batchYear;
      }
    },
  },
});

export const { setCourses, setDepartments, setBatches } = courseSlice.actions;

export default courseSlice.reducer;
