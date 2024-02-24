import { Form, redirect, useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Markdown from 'react-markdown';

import {
  FormInput,
  SelectInput,
  CheckboxInput,
  MultipleInputs,
  NumberInput,
  DateInput,
} from '../Components';

import {
  getCourseOptions,
  getDepartmentOptions,
  getBatchOptions,
  formatDate,
  customFetch,
  fetchJobsQuery,
} from '../utils';

import { setCurrentJobs } from '../features/jobs/jobsSlice';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Handle Job Creation & Updation */
    if (intent === 'createJob') {
      /* Transforming Into Array */
      const receivingDepartments = formData.getAll('receivingDepartments');
      const keySkills = formData.getAll('keySkills');

      const data = Object.fromEntries(formData);
      data.receivingDepartments = receivingDepartments;
      data.keySkills = keySkills;

      const url = `/company/jobs`;

      try {
        await customFetch.post(url, data);
        await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
        const { jobs } = await queryClient.fetchQuery(
          fetchJobsQuery({ role: 'company_admin', status: 'open' })
        );
        store.dispatch(setCurrentJobs({ jobs }));
        toast.success('Job created successfully!');
        return redirect('/company-dashboard/jobs');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to create job!';
        toast.error(errorMessage);
        return error;
      }
    }
  };
};

const JobCreatePage = () => {
  const courseOptions = useSelector((state) => state.courseOptions);

  const [description, setDescription] = useState('');
  const [deptOptions, setDeptOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [skillFields, setSkillFields] = useState(['']);

  const todayDate = new Date();

  return (
    <div className="p-8">
      <h3 className="font-bold text-2xl underline capitalize">Create Job</h3>
      <Form
        method="POST"
        className="mt-2 flex flex-col gap-4"
        name="createJobForm"
      >
        <FormInput label="Profile" name="profile" type="text" />

        <label htmlFor="description" className="label">
          <span className="font-medium">Job Description</span>
        </label>
        {/* JOB DESCRIPTION */}
        <div role="tablist" className="tabs tabs-lifted">
          <>
            <input
              type="radio"
              name="job-description"
              role="tab"
              className="tab capitalize text-blue-500"
              aria-label="Content"
              defaultChecked={true}
            />
            <div role="tabpanel" className="mt-4 tab-content">
              <textarea
                className="textarea w-full whitespace-pre-line textarea-bordered p-4"
                placeholder="Mention job responsibilities and requirements!"
                name="description"
                rows="8"
                onChange={(e) => {
                  setDescription(e.currentTarget.value);
                }}
                value={description}
              ></textarea>
            </div>
          </>

          <>
            <input
              type="radio"
              name="job-description"
              role="tab"
              className="tab capitalize text-blue-500"
              aria-label="Preview"
              defaultChecked={false}
            />
            <div role="tabpanel" className="mt-4 tab-content">
              <div className="flex flex-col gap-y-4 job-markdown text-justify overflow-auto h-60 rounded-lg border p-4">
                <Markdown>{description}</Markdown>
              </div>
            </div>
          </>
        </div>

        <SelectInput
          label="Select Course"
          options={getCourseOptions(courseOptions)}
          id="createJobCourse"
          changeFn={handleCourseChange}
          name="receivingCourse"
        />

        <CheckboxInput
          label="Select Deparments"
          options={deptOptions}
          name="receivingDepartments"
          emptyMsg="Select a course!"
        />

        <SelectInput
          label="Select Batch"
          options={batchOptions}
          id="createJobBatch"
          name="receivingBatch"
          emptyMessage="No batches found for this course!"
        />

        <MultipleInputs
          label="Key Skills"
          name="keySkills"
          type="text"
          defaultValue={skillFields}
          manageFields={setSkillFields}
        />

        <div className="flex flex-wrap justify-between gap-y-4">
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

          <DateInput
            label="Deadline"
            name="deadline"
            minDate={formatDate(todayDate)}
            size="w-fit"
          />
        </div>

        <button
          type="submit"
          className="btn btn-success self-center capitalize text-white btn-sm h-9 px-4"
          name="intent"
          value="createJob"
        >
          Create
        </button>
      </Form>
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
export default JobCreatePage;
