import { Form, redirect } from 'react-router-dom';
import { FaEdit, FaPlusSquare, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

import { FormInput, DateInput } from '../';
import { formatDate, customFetch, fetchStudentExperiences } from '../../utils';
import { setExperiences } from '../../features/studentProfile/studentProfileSlice';

const StudentExperience = () => {
  const experiences = useSelector(
    (state) => state?.studentProfileState?.experiences
  );

  const [modalData, setModalData] = useState({ action: 'create' });
  return (
    <section id="experience">
      <ExperienceModal modalData={modalData} />
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-medium mb-4">Experience</h3>
        <button
          className="flex items-center gap-x-2"
          onClick={() => {
            setModalData({ action: 'create' });
            document.getElementById('experienceFormError').innerText = '';
            document.getElementById('experienceModal').showModal();
          }}
        >
          <FaPlusSquare />
          New
        </button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-8 lg:grid-cols-3">
        {experiences?.length ? (
          experiences.map((experience) => (
            <ExperienceContainer
              key={experience._id}
              experience={experience}
              setModalData={setModalData}
            />
          ))
        ) : (
          <p>No experiences found!</p>
        )}
      </div>
    </section>
  );
};

const ExperienceContainer = ({ experience, setModalData }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { jobProfile, company } = experience;
  let { startDate, endDate } = experience;
  startDate = new Date(startDate).toLocaleDateString();
  if (endDate) endDate = new Date(endDate).toLocaleDateString();

  return (
    <div className="max-w-80 sm:max-w-96 rounded border shadow p-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold tracking-wider">{jobProfile}</h3>
        <div className="flex flex-row gap-x-2">
          <button
            onClick={() => {
              setModalData({
                action: 'update',
                experience,
              });
              document.getElementById('experienceFormError').innerText = '';
              document.getElementById('experienceModal').showModal();
            }}
          >
            <FaEdit />
          </button>
          <button
            onClick={() =>
              handleDeleteExperience({
                dispatch,
                queryClient,
                id: experience._id,
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
          <span className="font-medium">Start Date: </span>
          <span>{startDate}</span>
        </p>
        {endDate && (
          <p>
            <span className="font-medium">End Date: </span>
            <span>{endDate}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const ExperienceModal = ({ modalData }) => {
  const { action, experience } = modalData;
  return (
    <dialog id="experienceModal" className="modal">
      <div className="modal-box pb-0">
        <h3 className="font-bold text-lg underline capitalize">
          {action} experience
        </h3>
        <Form
          method="POST"
          className="mt-2 flex flex-col gap-4"
          name="experienceForm"
        >
          {action === 'update' && (
            <input
              type="text"
              name="experienceId"
              defaultValue={experience?._id}
              hidden
            />
          )}
          <FormInput
            label="Profile"
            name="jobProfile"
            type="text"
            defaultValue={experience?.jobProfile}
          />
          <FormInput
            label="Company"
            name="company"
            type="text"
            defaultValue={experience?.company}
          />
          <DateInput
            label="Start Date"
            name="startDate"
            size="w-fit"
            defaultValue={
              experience?.startDate &&
              formatDate(new Date(experience?.startDate))
            }
            maxDate={formatDate(new Date())}
          />
          <DateInput
            label="End Date"
            name="endDate"
            size="w-fit"
            defaultValue={
              experience?.endDate && formatDate(new Date(experience?.endDate))
            }
            maxDate={formatDate(new Date())}
            isRequired={false}
          />

          <div id="experienceFormError" className="text-red-500"></div>

          <button
            type="submit"
            className="btn btn-success text-white capitalize self-center btn-sm h-9 px-4"
            name="intent"
            value={`${action}Experience`}
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

async function handleDeleteExperience({ queryClient, dispatch, id }) {
  try {
    await customFetch.delete(`/student/experience/${id}`);
    queryClient.removeQueries({ queryKey: ['experiences'] });
    const { experiences } = await queryClient.fetchQuery(
      fetchStudentExperiences()
    );
    dispatch(setExperiences({ experiences }));
    toast.success('Experience deleted successfully!');
    return redirect('/student-dashboard/');
  } catch (error) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || 'Failed to delete experience!';
    toast.error(errorMessage);
    return error;
  }
}

export default StudentExperience;
