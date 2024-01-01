import { useLoaderData } from 'react-router-dom';
import ScoreInfo from './ScoreInfo';

const StudentEducation = () => {
  const { education } = useLoaderData();
  const { batchId, courseId, departmentId, education_details, roll_no } =
    education.data;

  const {
    is_lateral_entry,
    diploma_board,
    diploma_year,
    diploma_score,
    highschool_board,
    highschool_year,
    highschool_score,
    intermediate_board,
    intermediate_year,
    intermediate_score,
  } = education_details;

  return (
    <section id="education" className="w-fit p-8 border shadow">
      <h3 className="text-center text-2xl font-medium mb-4">
        Education Details
      </h3>
      {/* INFO */}
      <div className='flex flex-col gap-y-2'>
        <p>
          {courseId.courseName}{' '}
          {is_lateral_entry && (
            <span className="badge badge-success">lateral</span>
          )}
        </p>
        <p>
          {departmentId.departmentName}{' '}
          <span className="badge badge-success">{batchId.batchYear}</span>
        </p>
        <p>Roll No: {roll_no}</p>
      </div>
      {/* HIGHSCHOOL */}
      <ScoreInfo
        title="HighSchool"
        score={highschool_score}
        board={highschool_board}
        year={highschool_year}
      />
      {/* INTER / DIPLOMA */}
      {is_lateral_entry ? (
        <ScoreInfo
          title="Diploma"
          score={diploma_score}
          board={diploma_board}
          year={diploma_year}
        />
      ) : (
        <ScoreInfo
          title="Intermediate"
          score={intermediate_score}
          board={intermediate_board}
          year={intermediate_year}
        />
      )}
    </section>
  );
};
export default StudentEducation;
