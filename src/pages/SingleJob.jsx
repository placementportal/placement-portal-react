import { useLoaderData, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { FiExternalLink } from 'react-icons/fi';

import { toast } from 'react-toastify';
import { FaEdit, FaExternalLinkAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Markdown from 'react-markdown';

import {
  customFetch,
  fetchJobsQuery,
  fetchSingleJobQuery,
  getCompanyWebsite,
} from '../utils';
import {
  resetJobApply,
  setCurrentJobs,
  setJobApply,
} from '../features/jobs/jobsSlice';
import { JobApplicationForm } from '../Components';

export const action = (queryClient, store) => {
  return async function ({ request }) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    /* Handle Job Apply */
    if (intent === 'jobApplyAction') {
      const jobId = store.getState()?.jobState?.jobApply?.jobId;
      const url = `/student/jobs/${jobId}/apply`;
      try {
        await customFetch.post(url, formData);
        await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
        await queryClient.refetchQueries({ queryKey: ['jobs', 'applied'] });
        const { jobs } = await queryClient.fetchQuery(
          fetchJobsQuery({ role: 'student', status: 'open' })
        );
        store.dispatch(setCurrentJobs({ jobs }));
        store.dispatch(resetJobApply());
        document.getElementById('jobApplicationModal').close();
        document.getElementById('jobApplicationFormError').innerText = '';
        toast.success('Applied successfully!');
        return redirect('/student-dashboard/jobs');
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || 'Failed to apply for job!';
        document.getElementById('jobApplicationFormError').innerText =
          errorMessage;
        return error;
      }
    }
  };
};

export const loader = (queryClient, store) => {
  return async function ({ params }) {
    const { role } = store.getState()?.userState?.user;
    const jobId = params.jobId;

    try {
      const { job } = await queryClient.ensureQueryData(
        fetchSingleJobQuery({ role, jobId })
      );
      return { job };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch job!';
      console.log(error);
      toast.error(errorMessage);
      return null;
    }
  };
};

const SingleJob = () => {
  const role = useSelector((state) => state?.userState?.user?.role);
  const { job } = useLoaderData();

  const {
    _id,
    profile,
    openingsCount,
    applicationsCount,
    description,
    location,
    company,
    jobPackage,
    keySkills,
    postedBy,
    applicationStatus,
    deadline,
  } = job;

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return (
    <div className="p-8 flex flex-col gap-y-4">
      <JobApplicationForm />
      <div className="flex gap-x-4">
        <div className="flex gap-x-4">
          <h3 className="font-semibold tracking-wide text-2xl">{profile}</h3>
          {role == 'student' &&
            (applicationStatus == 'applied' ? (
              <button className="w-fit self-center text-white btn btn-sm btn-info">
                Applied
              </button>
            ) : applicationStatus == 'hired' ? (
              <button className="w-fit self-center text-white btn btn-sm btn-success">
                Hired
              </button>
            ) : applicationStatus == 'rejected' ? (
              <button className=" w-fit self-center btn btn-sm btn-error">
                Rejected
              </button>
            ) : applicationStatus == 'shortlisted' ? (
              <button className=" w-fit self-center btn btn-sm btn-warning">
                Shortlisted
              </button>
            ) : (
              <button
                className="hover:scale-125 w-fit self-center text-white btn btn-success btn-sm"
                onClick={() => {
                  dispatch(
                    setJobApply({
                      jobApply: {
                        jobId: _id,
                        profile,
                        company: company.name,
                      },
                    })
                  );
                  document.getElementById('jobApplicationModal').showModal();
                }}
              >
                Apply
              </button>
            ))}
        </div>
        {role == 'company_admin' && applicationsCount === 0 && (
          <div className="flex items-center gap-2 justify-end">
            <Link to={`/company-dashboard/edit-job/${_id}`}>
              <FaEdit />
            </Link>
            <button
              onClick={() =>
                handleDeleteJob({ queryClient, dispatch, id: _id })
              }
            >
              <MdDelete />
            </button>
          </div>
        )}
      </div>

      <a
        className="font-bold flex gap-2 items-center tracking-wider link max-w-[50%] "
        href={company?.website ? getCompanyWebsite(company.website) : ''}
        target="_blank"
      >
        {company.name} <FaExternalLinkAlt />
      </a>

      <div className="flex flex-wrap gap-x-16 gap-y-4">
        {/* LEFT */}
        <div
          className={`md:max-w-[${
            role === 'company_admin' ? 40 : 30
          }%] flex flex-col gap-y-2`}
        >
          <p>
            <span className="font-medium">Posted By:</span> {postedBy.name}
          </p>
          <p>
            <span className="font-medium">Openings Count:</span> {openingsCount}
          </p>
          <p className="flex items-center gap-x-2">
            <span className="font-medium">Applications Count:</span>{' '}
            {applicationsCount}{' '}
            {role === 'company_admin' && (
              <Link to="applications">
                <FiExternalLink />
              </Link>
            )}
          </p>

          {role === 'company_admin' && (
            <>
              <div>
                <span className="font-medium">Receiving Course:</span>{' '}
                {job?.receivingCourse?.courseName}
              </div>
              <div>
                <span className="font-medium">Receiving Batch:</span>{' '}
                {job?.receivingBatch?.batchYear}
              </div>
              <div>
                <span className="font-medium">Receiving Departments:</span>{' '}
                {job?.receivingDepartments
                  ?.map((dept) => dept?.departmentName)
                  ?.join(', ')}
              </div>
            </>
          )}

          <p>
            <span className="font-medium">Deadline:</span>{' '}
            {new Date(deadline).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Location:</span> {location}
          </p>
          <p>
            <span className="font-medium">Package:</span> {jobPackage} LPA
          </p>
        </div>

        {/* END */}
        <div
          className={`md:max-w-[${
            role === 'company_admin' ? 55 : 65
          }%] flex flex-col gap-y-2`}
        >
          <p className="font-medium">Key Skills:</p>
          <div className="flex flex-wrap gap-4">
            {keySkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-block py-1 px-2 rounded-lg text-sm bg-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 job-markdown text-justify">
        <h3 className="font-medium text-lg underline">Description:</h3>
        <Markdown>{description}</Markdown>
      </div>
    </div>
  );
};

async function handleDeleteJob({ queryClient, dispatch, id }) {
  try {
    await customFetch.delete(`/company/jobs/${id}`);
    queryClient.removeQueries({ queryKey: ['jobs', 'open'] });
    const { jobs } = await queryClient.fetchQuery(
      fetchJobsQuery({ role: 'company_admin', status: 'open' })
    );
    dispatch(setCurrentJobs({ jobs }));
    toast.success('Job deleted successfully!');
    return redirect('/company-dashboard/jobs');
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || 'Failed to delete job!';
    toast.error(errorMessage);
    return error;
  }
}

export default SingleJob;
