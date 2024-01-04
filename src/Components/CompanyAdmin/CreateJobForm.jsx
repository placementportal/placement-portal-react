import { Form } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  FormInput,
  Textarea,
  SelectInput,
  CheckboxInput,
  MultipleInputs,
  NumberInput,
  DateInput,
} from '../';

import {
  getCourseOptions,
  fetchDeptQuery,
  fetchBatchQuery,
  getDepartmentOptions,
  getBatchOptions,
  formatDate
} from '../../utils';

import {
  setDepartments,
  setBatches,
} from '../../features/courseInfo/courseInfoSlice';

const CreateJobForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courseInfoState);
  const [deptOptions, setDeptOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);

  async function handleCourseChange() {
    const courseId = document.getElementById('createJobCourse').value;

    if (!courseId || courseId == -1) {
      setDeptOptions([]);
      setBatchOptions([]);
    } else {
      const { departments } = await queryClient.ensureQueryData(
        fetchDeptQuery(courseId)
      );
      const { batches } = await queryClient.ensureQueryData(
        fetchBatchQuery(courseId)
      );
      dispatch(setDepartments({ courseId, departments }));
      setDeptOptions(getDepartmentOptions(departments));
      dispatch(setBatches({ courseId, batches }));
      setBatchOptions(getBatchOptions(batches));
    }
  }

  const todayDate = new Date();
  const laterDate = new Date();
  laterDate.setMonth(todayDate.getMonth() + 1);

  return (
    <dialog id="createJobModal" className="modal">
      <div className="modal-box pb-0">
        <h3 className="font-bold text-lg underline">Create Job</h3>
        <Form
          method="POST"
          encType="multipart/form-data"
          className="mt-2 flex flex-col gap-4"
          name="createJobForm"
        >
          <FormInput label="Profile" name="profile" type="text" />
          <Textarea
            label="Description"
            name="description"
            placeholder="Mention Job Qualifications and Responsibilities"
          />

          <SelectInput
            label="Select Course"
            options={getCourseOptions(courses)}
            id="createJobCourse"
            changeFn={handleCourseChange}
            name="receivingCourse"
          />

          <CheckboxInput
            label="Select Deparments"
            options={deptOptions}
            name="receivingDepartments"
            emptyMsg="No departments"
          />

          <CheckboxInput
            label="Select Batches"
            options={batchOptions}
            name="receivingBatches"
            emptyMsg="No batches"
          />

          <FormInput
            label="Location"
            name="location"
            type="text"
            size="w-fit"
          />

          <NumberInput
            label="Package (LPA)"
            name="jobPackage"
            minValue={1}
            size="w-fit"
          />

          <NumberInput
            label="Openings Count"
            name="openingsCount"
            minValue={1}
            size="w-fit"
          />

          <MultipleInputs label="Key Skills" name="keySkills" type="text" />

          <DateInput
            label="Deadline"
            name="deadline"
            minDate={formatDate(todayDate)}
            defaultValue={formatDate(laterDate)}
            size="w-fit"
          />

          <button
            type="submit"
            className="btn btn-success self-center btn-sm h-9 px-4"
            name="intent"
            value="createJob"
          >
            Create
          </button>
        </Form>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
export default CreateJobForm;
