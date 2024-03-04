import { Form } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormInput, NumberInput, SelectInput } from '../';
import { useEffect, useState } from 'react';

const CourseModal = () => {
  const { action, course } = useSelector((state) => state.courseModalState);
  const [isLateralEntry, setIsLateralEntry] = useState(false);

  useEffect(() => {
    if (course?.courseId) setIsLateralEntry(course?.isLateralAllowed);
    else setIsLateralEntry(false);
  }, [action, course?.courseId]);

  return (
    <dialog id="courseModal" className="modal">
      <div className="modal-box pb-0">
        <h3 className="font-bold text-lg underline capitalize">
          {action} course
        </h3>
        <Form
          method="POST"
          className="mt-2 flex flex-col gap-4"
          name="courseForm"
        >
          {action === 'update' && (
            <input
              type="text"
              name="courseId"
              defaultValue={course?.courseId}
              hidden
            />
          )}
          <FormInput
            label="course name"
            name="courseName"
            type="text"
            defaultValue={course?.courseName}
          />

          <SelectInput
            label="course level"
            name="courseLevel"
            options={[
              {
                text: 'Graduation',
                value: 'graduation',
              },
              {
                text: 'Post Graduation',
                value: 'postGraduation',
              },
            ]}
            defaultValue={course?.courseLevel}
          />

          <NumberInput
            label="regular year count"
            name="regularYearsCount"
            minValue={1}
            defaultValue={course?.regularYearsCount}
          />

          <NumberInput
            label="regular semesters count"
            name="regularSemestersCount"
            minValue={1}
            defaultValue={course?.regularSemestersCount}
          />

          <div className="form-control">
            <label className="label">
              <span className="font-medium">Is Lateral Entry Allowed?</span>
            </label>
            <label className="label justify-normal gap-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isLateralAllowed"
                className="checkbox"
                checked={isLateralEntry}
                onChange={(e) => setIsLateralEntry(e.currentTarget.checked)}
              />
              <span className="label-text">Yes</span>
            </label>
          </div>

          {isLateralEntry && (
            <>
              <NumberInput
                label="lateral year count"
                name="lateralYearCount"
                minValue={1}
                defaultValue={course?.lateralYearsCount}
              />

              <NumberInput
                label="lateral semesters count"
                name="lateralSemestersCount"
                minValue={1}
                defaultValue={course?.lateralSemestersCount}
              />
            </>
          )}

          <div id="courseFormError" className="text-red-500"></div>

          <button
            type="submit"
            className="btn btn-success text-white capitalize self-center btn-sm h-9 px-4"
            name="intent"
            value={`${action}Course`}
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
export default CourseModal;
