import { Form, redirect } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlusSquare } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

import { FormInput, FileInput, DateInput, NumberInput } from '../';
import { formatDate, customFetch, fetchStudentPlacements } from '../../utils';
import { setPlacements } from '../../features/studentProfile/studentProfileSlice';

const StudentPlacement = () => {
  const placements = useSelector(
    (state) => state?.studentProfileState?.placements
  );
  const [modalData, setModalData] = useState({ action: 'create' });
  return (
    <>
      <input
        type="radio"
        name="details2"
        role="tab"
        className="tab capitalize sm:text-lg text-blue-500"
        aria-label="placements"
        defaultChecked={true}
      />
      <div role="tabpanel" className="mt-4 tab-content">
        <PlacementModal modalData={modalData} />
        <div className="flex justify-between">
          <h3 className="text-2xl font-medium">Placements</h3>
          <button
            className="flex items-center tracking-wide h-8 gap-x-2 font-semibold bg-green-500 px-2 rounded text-white hover:shadow-lg"
            onClick={() => {
              setModalData({ action: 'create' });
              document.getElementById('placementModal').showModal();
            }}
          >
            <FaPlusSquare />
            New
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:gap-8 lg:grid-cols-3">
          {placements?.length ? (
            placements.map((placement) => (
              <PlacementContainer
                key={placement._id}
                placement={placement}
                setModalData={setModalData}
              />
            ))
          ) : (
            <p>No placements found!</p>
          )}
        </div>
      </div>
    </>
  );
};

const PlacementContainer = ({ placement, setModalData }) => {
  const {
    jobProfile,
    company,
    location,
    package: packageAMT,
    offerLetter,
    joiningLetter,
  } = placement;
  let { joiningDate } = placement;

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  if (joiningDate) joiningDate = new Date(joiningDate).toLocaleDateString();

  return (
    <div className="max-w-80 sm:max-w-96 rounded border shadow p-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold tracking-wider">{jobProfile}</h3>
        <div className="flex flex-row gap-x-2">
          <button
            onClick={() => {
              setModalData({
                action: 'update',
                placement,
              });
              document.getElementById('placementFormError').innerText = '';
              document.getElementById('placementModal').showModal();
            }}
          >
            <FaEdit />
          </button>
          <button
            onClick={() =>
              handleDeletePlacement({
                dispatch,
                queryClient,
                id: placement._id,
              })
            }
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-y-2">
        <p>
          <span className="font-medium">Company: </span>
          <span>{company}</span>
        </p>
        <p>
          <span className="font-medium">Package: </span>
          <span>{packageAMT} LPA</span>
        </p>
        <p>
          <span className="font-medium">Location: </span>
          <span>{location}</span>
        </p>
        {joiningDate && (
          <p>
            <span className="font-medium">Joining Date: </span>
            <span>{joiningDate}</span>
          </p>
        )}
        {offerLetter && (
          <p>
            <span className="font-medium">Offer Letter: </span>
            <a href={offerLetter}>View File</a>
          </p>
        )}
        {joiningLetter && (
          <p>
            <span className="font-medium">Joining Letter: </span>
            <a href={joiningLetter}>View File</a>
          </p>
        )}
      </div>
    </div>
  );
};

const PlacementModal = ({ modalData }) => {
  const { action, placement } = modalData;
  return (
    <dialog id="placementModal" className="modal">
      <div className="modal-box pb-0">
        <h3 className="font-bold text-lg underline capitalize">
          {action} placement
        </h3>
        <Form
          method="POST"
          className="mt-2 flex flex-col gap-4"
          name="placementForm"
          encType="multipart/form-data"
        >
          {action === 'update' && (
            <input
              type="text"
              name="placementId"
              defaultValue={placement?._id}
              hidden
            />
          )}
          <FormInput
            label="job profile"
            name="jobProfile"
            type="text"
            defaultValue={placement?.jobProfile}
          />
          <FormInput
            label="company"
            name="company"
            type="text"
            defaultValue={placement?.company}
          />
          <FormInput
            label="location"
            name="location"
            type="text"
            defaultValue={placement?.location}
          />
          <NumberInput
            label="package (LPA)"
            name="package"
            defaultValue={placement?.package}
          />
          <FileInput
            label="offer letter"
            name="offerLetter"
            accept="application/pdf"
          />
          <FileInput
            label="joining letter"
            name="joiningLetter"
            accept="application/pdf"
          />
          <DateInput
            label="joining Date"
            name="joiningDate"
            size="w-fit"
            defaultValue={
              placement?.joiningDate &&
              formatDate(new Date(placement?.joiningDate))
            }
            isRequired={false}
          />
          <div id="placementFormError" className="text-red-500"></div>
          <button
            type="submit"
            className="btn btn-success text-white capitalize self-center btn-sm h-9 px-4"
            name="intent"
            value={`${action}Placement`}
          >
            {action}
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

async function handleDeletePlacement({ queryClient, dispatch, id }) {
  try {
    await customFetch.delete(`/student/placement/${id}`);
    queryClient.removeQueries({ queryKey: ['placements'] });
    const { placements } = await queryClient.fetchQuery(
      fetchStudentPlacements()
    );
    dispatch(setPlacements({ placements }));
    toast.success('Placement deleted successfully!');
    return redirect('/student-dashboard/');
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || 'Failed to delete placement!';
    toast.error(errorMessage);
    return error;
  }
}

export default StudentPlacement;
