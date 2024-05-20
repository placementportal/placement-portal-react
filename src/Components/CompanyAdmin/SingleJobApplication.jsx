import { Link } from 'react-router-dom';
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { FiExternalLink } from 'react-icons/fi';

const SingleJobApplication = ({
  jobId,
  profile,
  openingsCount,
  deadline,
  applications,
  setModalData,
}) => {
  let pending = [],
    shortlisted = [],
    hired = [],
    rejected = [];

  for (let item of applications) {
    const status = item._id.status;
    switch (status) {
      case 'pending':
        pending = item.applications;
        break;
      case 'shortlisted':
        shortlisted = item.applications;
        break;
      case 'hired':
        hired = item.applications;
        break;
      case 'rejected':
        rejected = item.applications;
        break;
    }
  }

  return (
    <div className="py-4 px-8 flex flex-col gap-y-4">
      <Link
        to={`/company-dashboard/jobs/${jobId}`}
        className="text-xl font-medium tracking-wide flex gap-x-2 items-center underline hover:link-primary"
      >
        {profile} <FiExternalLink />
      </Link>
      <p className="flex gap-x-4">
        <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
        <span>Openings Count: {openingsCount}</span>
      </p>
      <div role="tablist" className="tabs tabs-lifted">
        <TabContent
          jobId={jobId}
          jobType="pending"
          arr={pending}
          setModalData={setModalData}
        />
        <TabContent
          jobId={jobId}
          jobType="shortlisted"
          arr={shortlisted}
          setModalData={setModalData}
        />
        <TabContent jobId={jobId} jobType="hired" arr={hired} />
        <TabContent jobId={jobId} jobType="rejected" arr={rejected} />
      </div>
    </div>
  );
};

const TabContent = ({ jobType, jobId, arr, setModalData }) => {
  return (
    <>
      <input
        type="radio"
        name={`${jobId}_tab`}
        role="tab"
        className="tab capitalize text-blue-500"
        aria-label={jobType}
        defaultChecked={jobType === 'pending'}
      />
      <div role="tabpanel" className="tab-content">
        {arr.length ? (
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="text-base font-normal">
                <tr>
                  <th>Name</th>
                  <th>Cover Letter</th>
                  <th>Resume</th>
                  <th>Portfolio</th>
                  {(jobType === 'pending' || jobType === 'shortlisted') && (
                    <th>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {arr.map((application) => {
                  const {
                    _id,
                    applicantName,
                    applicantId,
                    coverLetter,
                    resume,
                    portfolio,
                  } = application;
                  return (
                    <tr key={_id}>
                      <td>
                        <a
                          href={`/company-dashboard/applications/${_id}/students/${applicantId}`}
                          className="link"
                        >
                          {applicantName}
                        </a>
                      </td>
                      <td>{coverLetter}</td>
                      <td className="link">
                        <a href={resume} target="_blank">
                          Resume
                        </a>
                      </td>
                      <td className="link">
                        <a href={portfolio} target="_blank">
                          Portfolio
                        </a>
                      </td>
                      {jobType === 'pending' ? (
                        <td className="flex flex-wrap gap-2">
                          <ActionButton
                            action="shortlist"
                            applicationId={_id}
                          />
                          <ActionButton
                            action="hire"
                            applicationId={_id}
                            setModalData={setModalData}
                          />
                          <ActionButton action="reject" applicationId={_id} />
                        </td>
                      ) : (
                        jobType == 'shortlisted' && (
                          <td className="flex flex-wrap gap-2">
                            <ActionButton
                              action="hire"
                              applicationId={_id}
                              setModalData={setModalData}
                            />
                            <ActionButton action="reject" applicationId={_id} />
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4">No {jobType} applications</p>
        )}
      </div>
    </>
  );
};

const ActionButton = ({ action, applicationId, setModalData }) => {
  let btnClass = 'btn btn-sm capitalize ';
  switch (action) {
    case 'hire':
      btnClass += 'btn-success text-white';
      break;
    case 'reject':
      btnClass += 'btn-error text-white';
      break;
    case 'shortlist':
      btnClass += 'btn-warning';
      break;
  }

  return (
    <button
      className={btnClass}
      onClick={() => {
        if (action === 'hire') {
          setModalData({
            onCampus: true,
            action: 'create',
            applicationId,
          });
          document.getElementById('placementModal').showModal();
        } else {
          handleAction(applicationId, action);
        }
      }}
    >
      {action}
    </button>
  );
};

async function handleAction(applicationId, action) {
  const url = `/company/applications/${applicationId}/action/${action}`;
  try {
    const { data } = await customFetch.patch(url);
    const message = data?.message || 'successfully performed action!';
    toast.success(message);
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || 'Failed to perform action!';
    toast.error(errorMessage);
  }
}

export default SingleJobApplication;
