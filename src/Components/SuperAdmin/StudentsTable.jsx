import { Link, useLoaderData } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setModalData } from '../../features/createStudentModal/studentModalData';

const StudentsTable = () => {
  const dispatch = useDispatch();
  const { students, page, limit, totalPages, course, departments, batches } =
    useLoaderData();

  function getPageLink(pageNum) {
    if (pageNum < 1 || pageNum > totalPages)  {
      return 
    }

    let link = `${window.location.pathname}?page=${pageNum}&limit=${limit}`;
    if (course) {
      link += `&course=${course}`
    }
    if (departments) {
      link += `&departments=${departments}`
    }
    if (batches) {
      link += `&batches=${batches}`
    }

    return link;
  }

  const prevLinkClass = page > 1 ? 'btn btn-sm btn-secondary' : 'btn btn-sm'
  const nextLinkClass = page < totalPages ? 'btn btn-sm btn-secondary' : 'btn btn-sm'

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
        <div className="flex justify-between p-2">
          <Link to={getPageLink(page - 1)} className={prevLinkClass}>
            Prev
          </Link>
          <Link to={getPageLink(page + 1)} className={nextLinkClass}>
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};
export default StudentsTable;
