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
  fetchSingleJobQuery,
  customFetch,
  fetchJobsQuery,
} from '../utils';

import { setCurrentJobs } from '../features/jobs/jobsSlice';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Handle Job Creation & Updation */
    if (intent === 'updateJob') {
      /* Transforming Into Array */
      const receivingDepartments = formData.getAll('receivingDepartments');
      const keySkills = formData.getAll('keySkills');

      const data = Object.fromEntries(formData);
      data.receivingDepartments = receivingDepartments;
      data.keySkills = keySkills;

      const url = `/company/jobs/${data['jobId']}`;

      try {
        await customFetch.patch(url, data);
        await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
        const { jobs } = await queryClient.fetchQuery(
          fetchJobsQuery({ role: 'company_admin', status: 'open' })
        );
        store.dispatch(setCurrentJobs({ jobs }));
        toast.success('Job updated successfully!');
        return redirect('/company-dashboard/jobs');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || `Failed to update job!`;
        toast.error(errorMessage);
        return error;
      }
    }
  };
};

export const loader = (queryClient, store) => {
  return async function ({ params }) {
    const jobId = params.jobId;
    try {
      const { job: jobData } = await queryClient.ensureQueryData(
        fetchSingleJobQuery({ role: 'company_admin', jobId })
      );
      return { jobData };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch courses!';
      console.log(error);
      toast.error(errorMessage);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return redirect('/');
      }
      return error;
    }
  };
};

const JobEditPage = () => {
  const courseOptions = useSelector((state) => state.courseOptions);

  const { jobData } = useLoaderData();

  const receivingCourseId = jobData?.receivingCourse?.id;

  const defaultDeptOptions = receivingCourseId
    ? getDepartmentOptions(courseOptions[receivingCourseId]?.departments)
    : [];

  const defaultBatchOptions = receivingCourseId
    ? getBatchOptions(courseOptions[receivingCourseId]?.batches)
    : [];

  const [deptOptions, setDeptOptions] = useState(defaultDeptOptions);
  const [batchOptions, setBatchOptions] = useState(defaultBatchOptions);

  const [skillFields, setSkillFields] = useState(['']);
  const [defaultDeadline, setDefaultDeadline] = useState();

  useEffect(() => {
    setDeptOptions(defaultDeptOptions);
    setBatchOptions(defaultBatchOptions);
  }, [receivingCourseId]);

  useEffect(() => {
    if (jobData?.keySkills) {
      setSkillFields(jobData?.keySkills);
    }
  }, [jobData?.keySkills]);

  const todayDate = new Date();
  useEffect(() => {
    if (jobData?.deadline) {
      setDefaultDeadline(formatDate(new Date(jobData.deadline)));
    } else {
      const laterDate = new Date();
      laterDate.setMonth(todayDate.getMonth() + 1);
      setDefaultDeadline(formatDate(laterDate));
    }
  }, [jobData?.deadline]);

  return (
    <div className="p-8">
      <h3 className="font-bold text-2xl underline capitalize">Update Job</h3>
      <Form
        method="POST"
        className="mt-2 flex flex-col gap-4"
        name="updateJobForm"
      >
        <input type="text" name="jobId" defaultValue={jobData?._id} hidden />

        <FormInput
          label="Profile"
          name="profile"
          type="text"
          defaultValue={jobData?.profile}
        />

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
                value={jobData?.description}
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
                <Markdown>{jobData?.description}</Markdown>
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
          defaultValue={jobData?.receivingCourse?.id}
        />

        <CheckboxInput
          label="Select Deparments"
          options={deptOptions}
          name="receivingDepartments"
          defaultValues={jobData?.receivingDepartments?.map((item) => item.id)}
          emptyMsg="Select a course!"
        />

        <SelectInput
          label="Select Batch"
          options={batchOptions}
          id="createJobBatch"
          name="receivingBatch"
          emptyMessage="No batches found for this course!"
          defaultValue={jobData?.receivingBatch?.id}
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
            defaultValue={jobData?.location}
          />

          <NumberInput
            label="Package (LPA)"
            name="jobPackage"
            minValue={1}
            size="w-fit"
            defaultValue={jobData?.jobPackage}
          />

          <NumberInput
            label="Openings Count"
            name="openingsCount"
            minValue={1}
            size="w-fit"
            defaultValue={jobData?.openingsCount}
          />

          <DateInput
            label="Deadline"
            name="deadline"
            minDate={formatDate(todayDate)}
            defaultValue={defaultDeadline}
            size="w-fit"
          />
        </div>

        <button
          type="submit"
          className="btn btn-success self-center capitalize text-white btn-sm h-9 px-4"
          name="intent"
          value="updateJob"
        >
          update
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
export default JobEditPage;
