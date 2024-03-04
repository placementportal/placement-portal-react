import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Form } from 'react-router-dom';

import { SelectInput, CheckboxInput, StudentsTable } from '../../Components';
import {
  fetchStudents,
  getCourseOptions,
  getDepartmentOptions,
  getBatchOptions,
} from '../../utils';

export const loader = (queryClient, store) => {
  return async function ({ request }) {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    const query = {};

    if (params.size) {
      query.course = params.get('course');
      query.departments = params.getAll('departments')?.join('|');
      query.batches = params.getAll('batches')?.join('|');
    }

    try {
      const { students } = await queryClient.ensureQueryData(
        fetchStudents(query)
      );
      return { students };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch students!';
      console.log(error);
      toast.error(errorMessage);
      return error;
    }
  };
};

const Students = () => {
  const courseOptions = useSelector((state) => state.courseOptions);
  const [deptOptions, setDeptOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);

  return (
    <div className="p-4">
      {/* FILTERS */}
      <Form className="flex flex-col gap-y-4">
        <div className="px-4 flex flex-wrap justify-between">
          <div>
            <SelectInput
              label="Select Course"
              options={getCourseOptions(courseOptions)}
              id="createJobCourse"
              changeFn={handleCourseChange}
              name="course"
            />
          </div>
          <div>
            <CheckboxInput
              label="Select Deparments"
              options={deptOptions}
              name="departments"
              emptyMsg="Select a course!"
            />
          </div>
          <div>
            <CheckboxInput
              label="Batches"
              options={batchOptions}
              name="batches"
              emptyMsg="no batches found!"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-success self-end capitalize text-white btn-sm px-4"
        >
          Filter
        </button>
      </Form>

      {/* TABLE */}

      <StudentsTable />
    </div>
  );

  async function handleCourseChange() {
    const courseId = document.getElementById('createJobCourse').value;

    if (!courseId || courseId == -1) {
      setDeptOptions([]);
      setBatchOptions([]);
    } else {
      const deptOptions = getDepartmentOptions(
        courseOptions[courseId].departments
      );
      setDeptOptions(deptOptions);
      const batchOptions = getBatchOptions(courseOptions[courseId].batches);
      setBatchOptions(batchOptions);
    }
  }
};
export default Students;
