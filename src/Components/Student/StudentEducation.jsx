import { Form } from 'react-router-dom';
import { CurrentCourseEducation, PastScoreContainer } from '../';
import { FormInput, NumberInput, SelectInput } from '../';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const StudentEducation = () => {
  const { courseLevel, isLateralEntry, semestersCount, educationDetails } =
    useSelector((state) => state.studentProfileState);

  let highschool, intermediate, diploma, graduation, postGraduation;

  if (educationDetails) {
    highschool = educationDetails?.highschool;
    intermediate = educationDetails?.intermediate;
    diploma = educationDetails?.diploma;
    graduation = educationDetails?.graduation;
    postGraduation = educationDetails?.postGraduation;
  }

  const [modalData, setModalData] = useState({ action: 'update' });

  const newOptions = [];
  if (!highschool)
    newOptions.push(getPastScoreOption('highschool', setModalData));
  if (!intermediate)
    newOptions.push(getPastScoreOption('intermediate', setModalData));
  if (!diploma) newOptions.push(getPastScoreOption('diploma', setModalData));
  if (courseLevel === 'postGraduation' && !graduation)
    newOptions.push(getPastScoreOption('graduation', setModalData));

  return (
    <>
      <input
        type="radio"
        name="details"
        role="tab"
        className="tab capitalize sm:text-lg text-blue-500"
        aria-label="education"
        defaultChecked={false}
      />

      <div role="tabpanel" className="mt-4 tab-content">
        <PastScoreModal modalData={modalData} />

        <div className="flex flex-wrap justify-between">
          <h3 className="text-2xl font-medium mb-4">Education Details</h3>
          {newOptions.length ? (
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm bg-green-300 hover:bg-green-500 "
              >
                Add New
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] w-fit menu p-2 shadow bg-base-100 rounded-box"
              >
                {newOptions}
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>

        <CurrentCourseEducation
          courseLevel={courseLevel}
          semestersCount={semestersCount}
          isLateralEntry={isLateralEntry}
          data={
            courseLevel === 'graduation'
              ? graduation?.scores
              : postGraduation?.scores
          }
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-8 lg:grid-cols-3">
          {courseLevel === 'postGraduation' && graduation && (
            <PastScoreContainer
              label="graduation"
              data={graduation}
              setModalData={setModalData}
            />
          )}

          {diploma && (
            <PastScoreContainer
              label="diploma"
              data={diploma}
              setModalData={setModalData}
            />
          )}

          {intermediate && (
            <PastScoreContainer
              label="intermediate"
              data={intermediate}
              setModalData={setModalData}
            />
          )}

          {highschool && (
            <PastScoreContainer
              label="highschool"
              data={highschool}
              setModalData={setModalData}
            />
          )}
        </div>
      </div>
    </>
  );
};

const PastScoreModal = ({ modalData }) => {
  const { action, data, label } = modalData;
  return (
    <dialog id="pastScoreModal" className="modal">
      <div className="modal-box pb-0">
        <h3 className="font-bold text-lg underline capitalize">
          {action} {label} data
        </h3>
        <Form
          method="POST"
          className="mt-2 flex flex-col gap-4"
          name={`${label}Form`}
        >
          <input type="text" name="update" defaultValue={label} hidden />

          <FormInput
            label="institute"
            name="institute"
            type="text"
            defaultValue={data?.institute}
          />

          <FormInput
            label="board"
            name="board"
            type="text"
            defaultValue={data?.board}
          />

          <FormInput
            label="stream"
            name="stream"
            type="text"
            defaultValue={data?.stream}
            isRequired={false}
          />

          <NumberInput
            label="year"
            name="year"
            defaultValue={data?.year}
            minValue={2000}
            maxValue={new Date().getFullYear()}
            step={1}
          />

          <div className="flex gap-x-4">
            <NumberInput
              label="score"
              name="score"
              defaultValue={data?.score}
              minValue={1}
              maxValue={data?.scale === 'percentage' ? 100 : 10}
              step={0.01}
            />

            <SelectInput
              label="scale"
              name="scale"
              options={[
                { text: 'GPA', value: 'GPA' },
                { text: '%', value: 'percentage' },
              ]}
              defaultValue={data?.scale}
              changeFn={(e) => {
                const value = e.currentTarget.value;
                if (value === 'GPA') {
                  document.forms[`${label}Form`].score.max = 10;
                } else {
                  document.forms[`${label}Form`].score.max = 100;
                }
              }}
            />
          </div>

          <div id="pastScoreError" className="text-red-500"></div>

          <button
            type="submit"
            className="btn btn-success text-white capitalize self-center btn-sm h-9 px-4"
            name="intent"
            value="updatePastEducation"
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

function getPastScoreOption(label, setModalData) {
  return (
    <li
      key={label}
      onClick={() => {
        setModalData({ action: 'create', label });
        document.getElementById('pastScoreModal').showModal();
      }}
      className="capitalize p-2 cursor-pointer rounded hover:bg-slate-300"
    >
      {label}
    </li>
  );
}

export default StudentEducation;
