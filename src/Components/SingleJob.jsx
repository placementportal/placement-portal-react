import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import {
  changeFilter,
  setCurrentJobs,
  setJobApplyId,
} from '../features/jobs/jobsSlice';
import { fetchJobsQuery } from '../pages/Jobs';
import { customFetch } from '../utils';
import { Link } from 'react-router-dom';

const SingleJob = ({ job, status, role }) => {
  const {
    _id,
    profile,
    description,
    openingsCount,
    applicantsCount,
    location,
    company,
    jobPackage,
    keySkills,
    postedBy,
    deadline,
  } = job;

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  async function applyHandler(jobId) {
    const url = `/student/jobs/${jobId}/apply`;
    try {
      await customFetch.patch(url);
      await queryClient.refetchQueries({ queryKey: ['jobs', 'open'] });
      const { jobs } = await queryClient.fetchQuery(fetchJobsQuery('applied'));
      dispatch(setCurrentJobs({ jobs }));
      dispatch(changeFilter({ newFilter: 'applied' }));
      toast.success('Applied successfully!');
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to apply for job!';
      toast.error(errorMessage);
    }
  }

  return (
    <div className="card gap-y-2 p-4 shadow-md hover:shadow-xl w-fit max-w-sm border-l-gray-700">
      {role == 'company_admin' && (
        <div className="flex items-center gap-4 justify-end">
          <button className="">
            <FaEdit />
          </button>
          <button>
            <MdDelete />
          </button>
        </div>
      )}
      <h3 className="font-semibold tracking-wide text-2xl">{profile}</h3>
      <div className="flex justify-between">
        <a
          className="font-bold tracking-wider"
          href={company.website}
          target="_blank"
        >
          {company.name}
        </a>
        <p>{postedBy.name}</p>
      </div>
      <p className="font-light">{description}</p>
      <p>Location: {location}</p>
      <p>Package: {jobPackage} LPA</p>
      <div className="flex flex-wrap gap-4">
        {keySkills.map((skill, idx) => (
          <span
            key={idx}
            className="inline-block py-1 px-2 font-light rounded-lg text-sm bg-slate-200"
          >
            {skill}
          </span>
        ))}
      </div>
      <p>Openings: {openingsCount}</p>
      <p>Applicants: {applicantsCount}</p>
      <p>Deadline: {new Date(deadline).toLocaleDateString()}</p>
      <Link className="btn btn-md btn-link w-fit self-center hover:scale-125">
        View Details
      </Link>
      {role == 'student' &&
        (status == 'applied' ? (
          <button className="w-fit self-center btn btn-sm btn-info">
            Applied
          </button>
        ) : status == 'selected' ? (
          <button className="w-fit self-center btn btn-sm btn-success">
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
          // <button
          //   className="hover:scale-125 w-fit self-center btn btn-success btn-sm"
          //   onClick={() => applyHandler(_id)}
          // >
          //   Apply
          // </button>
          <button
            className="hover:scale-125 w-fit self-center btn btn-success btn-sm"
            onClick={() => {
              dispatch(setJobApplyId({ jobApplyId: _id }));
              document.getElementById('jobApplicationModal').showModal();
            }}
          >
            Apply
          </button>
        ))}
    </div>
  );
};
export default SingleJob;
