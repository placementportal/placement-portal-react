import { Link, useLoaderData } from 'react-router-dom';
import { fetchSingleCompany } from '../../utils';
import { FaEdit, FaExternalLinkAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import defaultAvatar from '../../assets/default-avatar.jpg';
import { CompanyAdminCard } from '../../Components';

export const loader = (queryClient, store) => {
  return async function ({ params }) {
    const companyId = params.companyId;
    try {
      const { company } = await queryClient.ensureQueryData(
        fetchSingleCompany(companyId)
      );
      return { company };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch company!';
      console.log(error);
      toast.error(errorMessage);
      return error;
    }
  };
};

const SingleCompany = () => {
  const { company } = useLoaderData();
  if (!company)
    return <h3 className="p-8 text-2xl capitalize">no company found</h3>;

  const {
    photo,
    name,
    about,
    jobsPosted,
    openingsCreated,
    candidatesHired,
    admins,
  } = company;

  return (
    <div className="p-8">
      {/* INTO */}
      <div className="flex flex-col sm:flex-row gap-8 items-center">
        <div className="flex flex-col gap-y-4">
          <img
            src={photo || defaultAvatar}
            height="150"
            width="150"
            className="rounded-full"
          />
          <div className="text-center text-xl tracking-wide">{name}</div>
        </div>
        <div className="self-start sm:mt-4 sm:ml-4">
          <span className="text-lg font-medium">About: </span>
          {about}
        </div>
      </div>

      {/* STATS */}
      <div className="mt-4">
        <h3 className="font-medium underline text-xl">Jobs Data:</h3>
        <div className="mt-4 stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Jobs Posted</div>
            <div className="stat-value text-center">{jobsPosted}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Openings Created</div>
            <div className="stat-value text-center">{openingsCreated}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Candidates Hired</div>
            <div className="stat-value text-center">{candidatesHired}</div>
          </div>
        </div>
      </div>

      {/* ADMINS */}
      <div className="mt-4 p-2">
        <h3 className="font-medium underline text-xl">Admins:</h3>
        {admins?.length ? (
          <div className="mt-4 flex flex-wrap gap-4">
            {admins.map((admin) => (
              <CompanyAdminCard key={admin._id} admin={admin} />
            ))}
          </div>
        ) : (
          <div className="mt-4 text-xl capitalize font-medium">
            no admins found
          </div>
        )}
      </div>
    </div>
  );
};
export default SingleCompany;
