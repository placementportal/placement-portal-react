import { useDispatch } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import { Link, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import { setCurrentJobs, setJobApply } from '../features/jobs/jobsSlice';
import { useQueryClient } from '@tanstack/react-query';
import { customFetch, fetchJobsQuery, getCompanyWebsite } from '../utils';

const SingleJob = ({ job, status, role }) => {
  const {
    _id,
    profile,
    applicationsCount,
    location,
    company,
    jobPackage,
    keySkills,
    postedBy,
    deadline,
  } = job;

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return (
    <div className="card gap-y-2 border-t border-b-slate-200 p-4 shadow-md hover:shadow-xl w-sm border-l-gray-700">
      {role == 'company_admin' && applicationsCount === 0 && (
        <div className="flex items-center gap-4 justify-end">
          <Link to={`/company-dashboard/edit-job/${_id}`}>
            <FaEdit />
          </Link>
          <button
            onClick={() => handleDeleteJob({ queryClient, dispatch, id: _id })}
          >
            <MdDelete />
          </button>
        </div>
      )}
      <div className="flex gap-x-2 items-center">
        <h3 className="font-semibold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis text-2xl">
          {profile}
        </h3>
        <Link to={_id} className="scale-125">
          <FiExternalLink />
        </Link>
      </div>
      <div className="flex justify-between gap-x-4">
        <a
          className="font-bold tracking-wider link max-w-[50%] whitespace-nowrap overflow-hidden text-ellipsis"
          href={getCompanyWebsite(company.website)}
          target="_blank"
        >
          {company.name}
        </a>
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {postedBy.name}
        </p>
      </div>
      <p>
        <span className="font-medium">Location:</span> {location}
      </p>
      <p>
        <span className="font-medium">Package:</span> {jobPackage} LPA
      </p>
      <p className="font-medium">Key Skills:</p>
      <div className="flex flex-wrap gap-4">
        {keySkills.map((skill, idx) => (
          <span
            key={idx}
            className="inline-block py-1 px-2 rounded-lg text-sm bg-slate-200 max-w-[40%] overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {skill}
          </span>
        ))}
      </div>
      <p>
        <span className="font-medium">Deadline:</span>{' '}
        {new Date(deadline).toLocaleDateString()}
      </p>
      <Link
        className="btn btn-md btn-link w-fit self-center hover:scale-125"
        to={`${_id}`}
      >
        View Details
      </Link>
      {role == 'student' &&
        (status == 'applied' ? (
          <button className="w-fit self-center btn btn-sm btn-info">
            Applied
          </button>
        ) : status == 'hired' ? (
          <button className="w-fit self-center text-white btn btn-sm btn-success">
            Hired
          </button>
        ) : status == 'rejected' ? (
          <button className=" w-fit self-center btn btn-sm btn-error">
            Rejected
          </button>
        ) : status == 'shortlisted' ? (
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
    return redirect('/company-dashboard/');
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || 'Failed to delete job!';
    toast.error(errorMessage);
    return error;
  }
}

export default SingleJob;
