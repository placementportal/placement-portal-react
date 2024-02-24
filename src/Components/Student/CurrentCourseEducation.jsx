import { Form } from 'react-router-dom';
import { ScoreFieldInput } from '../';

const CurrentCourseEducation = ({
  courseLevel,
  isLateralEntry,
  semestersCount,
  data,
  type,
}) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4 capitalize">
        {courseLevel} Details
      </h3>
      <Form method="POST" className="flex flex-col gap-y-8">
        <input
          type="number"
          name="semestersCount"
          defaultValue={semestersCount}
          hidden
        />
        <input
          type="checkbox"
          name="isLateralEntry"
          defaultChecked={isLateralEntry}
          hidden
        />
        <input
          type="text"
          name="courseLevel"
          defaultValue={courseLevel}
          hidden
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {getFormFields({ semestersCount, isLateralEntry, data, type })}
        </div>
        <p id="currentCourseError"></p>
        {type === 'private' && (
          <button
            type="submit"
            className="btn btn-success max-w-fit self-end text-white btn-sm h-9 px-4"
            name="intent"
            value="updateCurrentEducation"
          >
            Update
          </button>
        )}
      </Form>
    </div>
  );
};

function getFormFields({ semestersCount, isLateralEntry, data, type }) {
  const fields = [];
  let sem = isLateralEntry ? 3 : 1;
  for (let i = 0; i < semestersCount; i++) {
    fields.push(
      <ScoreFieldInput
        key={`semester-${i}`}
        label={`Semester ${sem}`}
        data={data?.[i]}
        semesterNum={sem}
        type={type}
      />
    );
    ++sem;
  }
  return fields;
}

export default CurrentCourseEducation;
