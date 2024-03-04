import { useLoaderData } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setModalData } from '../../features/createStudentModal/studentModalData';

const StudentsTable = () => {
  const dispatch = useDispatch();
  const { students } = useLoaderData();

  return (
    <div className="p-2">
      <div className="max-h-[90vh] overflow-auto">
        <table className="table text-center table-pin-rows">
          {/* head */}
          <thead className="text-base font-normal">
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>{student.courseName}</td>
                <td>{student.batchYear}</td>
                <td>{student.departmentName}</td>
                <td className="flex gap-x-2">
                  <button
                    className="text-lg"
                    onClick={() => {
                      dispatch(setModalData({ student }));
                      document
                        .getElementById('addSingleStudentModal')
                        .showModal();
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button className="text-lg">
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentsTable;
